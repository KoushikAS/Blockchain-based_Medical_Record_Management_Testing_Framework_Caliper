'use strict';

const removeExisting = require('../composer-test-utils').clearAll;
const logger = require('../../../src/comm/util').getLogger('vehicle-lifecycle-network.js');
const os = require('os');
const uuid = os.hostname() + process.pid; // UUID for client within test

module.exports.info  = 'Healthcaare Network Performance Test';

let bc;
let busNetConnection;
let testAssetNum;
let testTransaction;
let factory;
let assetId;
const base_ns = 'org.healthcare.basic';


module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    busNetConnection = context;
    testAssetNum = args.testAssets;
    testTransaction = args.transaction;

    assetId = 0;
    factory = busNetConnection.getBusinessNetwork().getFactory();

    let doctorRegistry = await busNetConnection.get('admin').getParticipantRegistry(base_ns + '.Doctor');
    let patientRegistry = await busNetConnection.get('admin').getParticipantRegistry(base_ns + '.Patient');  
    let medicalInfoRegistry = await busNetConnection.get('admin').getAssetRegistry(base_ns + '.MedicalInfo'); 

    let doctor= new Array();
    let patient = new Array();
    let medicalInfo = new Array();

    switch(testTransaction) {
        case 'GivePermission':          
        patient.push(factory.newResource(namespace, 'Patient', 'Patient_0'));
        for(let i = 0; i < testAssetNum; i ++){
            medicalInfo.push(factory.newResource(base_ns,  'MedicalInfo', 'MedicalInfo_' + i));
        }

        populated = await patientRegistry.exists(patient.getIdentifier());

        break;
        default:
        throw new Error('No valid test Transaction specified');
    }

    try{
        if(!populated){
            logger.info('Adding test assets ...');
            await patientRegistry.addAll(patient);
            await doctorRegistry.addAll(doctor);
            await medicalInfoRegistry.addAll(medicalInfo);
            logger.info('Asset addition complete ...');
        } else {
            // Second test pass, update/remove
            logger.info('Updating test assets ...');
            await removeExisting(patientRegistry, 'Patient_');
            await removeExisting(doctorRegistry, 'Doctor_');
            await removeExisting(medicalInfoRegistry, 'MedicalInfo_');
            await patientRegistry.addAll(patient);
            await doctorRegistry.addAll(doctor);
            await medicalInfoRegistry.addAll(medicalInfo);
            logger.info('Asset update complete ...');
        }
    } catch (error) {
        logger.error('error in test init(): ', error);
        return Promise.reject(error);
    }
};

module.exports.run = function() {
    let transaction;
    switch (testTransaction) {
    case 'GivePermission': 
        transaction = factory.newTransaction(base_ns, 'GivePermission');
        transaction.MedicalInfo = factory.newRelationship(base_ns, 'MedicalInfo', 'MedicalInfo_0' );
        transaction.doctorId = 'Doctor_0' ;  
        logger.info('GIVEPERMISSION:'+transaction)
        return  bc.bcObj.submitTransaction(busNetConnection.get('PatientCard_' + uuid + '_0' ), transaction);   
    default: 
        throw new Error('No valid test Transaction specified');
    }
};

module.exports.end = function() {
    return Promise.resolve(true);
};
'use strict';

//config.yaml - txNumber: #times run() should be implmented

const removeExisting = require('../composer-test-utils').clearAll;
const composerUtils = require('../../../src/adapters/composer/composer_utils');
const logger = require('../../../src/comm/util').getLogger('healthcare.js');
const os = require('os');
const uuid = os.hostname() + process.pid; // UUID for client within test

module.exports.info  = 'Healthcaare Network Performance Test';

let bc;
let busNetConnections;
// let busNetConnection;
let testAssetNum;
let testTransaction;
let factory;
let populated;
let patient;
const base_ns = 'org.healthcare.basic';
const busNetName = 'healthcare';


module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    busNetConnections = new Map();
    busNetConnections.set('admin', context);
    // busNetConnection = context;
    testAssetNum = args.testAssets;         //config.yaml - testAssets mapped to args.testAssets
    testTransaction = args.transaction;

    factory = busNetConnections.get('admin').getBusinessNetwork().getFactory();
    // factory = busNetConnection.getBusinessNetwork().getFactory();

    let doctorRegistry = await busNetConnections.get('admin').getParticipantRegistry(base_ns + '.Doctor');
    let patientRegistry = await busNetConnections.get('admin').getParticipantRegistry(base_ns + '.Patient');  
    let medicalInfoRegistry = await busNetConnections.get('admin').getAssetRegistry(base_ns + '.MedicalInfo'); 

    // let doctorRegistry = await busNetConnection.getParticipantRegistry(base_ns + '.Doctor');
    // let patientRegistry = await busNetConnection.getParticipantRegistry(base_ns + '.Patient');  
    // let medicalInfoRegistry = await busNetConnection.getAssetRegistry(base_ns + '.MedicalInfo'); 

    let doctor= new Array();
    let patients = new Array();
    let medicalInfos = new Array();

    switch(testTransaction) {
        case 'RevokePermission':
        case 'GivePermission':    
        patient = factory.newResource(base_ns, 'Patient', 'Patient_0');
        patient.firstName = "Peter";
        patient.lastName = "Parker";
        patient.age = "18";
        patient.address = "NYU";
        patient.phNo = "8888888888";      
        patients.push(patient);

        for(let i = 0; i < testAssetNum; i ++){
            let medicalInfo = factory.newResource(base_ns,  'MedicalInfo', 'MedicalInfo_' + i);
            medicalInfo.owner = factory.newRelationship(base_ns, 'Patient', 'Patient_0');
            medicalInfo.medication = 'Spider Bite Medicine';
            medicalInfo.pastVisitsArray = [];
            medicalInfo.permissionedDoctorsId = [];
            medicalInfos.push(medicalInfo);
        }

        populated = await patientRegistry.exists(patients[0].getIdentifier());

        break;  transaction.asset = factory.newRelationship(base_ns, 'MedicalInfo', 'MedicalInfo_0' );
        default:
        throw new Error('No valid test Transaction specified');
    }
    logger.info("populated "+populated)
    try{
        if(!populated){
            logger.info('Adding test assets ...');
            await patientRegistry.addAll(patients);
            await doctorRegistry.addAll(doctor);
            await medicalInfoRegistry.addAll(medicalInfos);
            logger.info('Asset addition complete ...');
        } else {
            // Second test pass, update/remove
            logger.info('Updating test assets ...');
            await removeExisting(patientRegistry, 'Patient_');
            await removeExisting(doctorRegistry, 'Doctor_');
            await removeExisting(medicalInfoRegistry, 'MedicalInfo_');
            await patientRegistry.addAll(patients);
            await doctorRegistry.addAll(doctor);
            await medicalInfoRegistry.addAll(medicalInfos);
            logger.info('Asset update complete ...');
        }

        logger.info('About to create new patient card');
        let userName = 'PatientCard_0';
        let newConnection = await composerUtils.obtainConnectionForParticipant(busNetConnections.get('admin'), busNetName, patient, userName);
        busNetConnections.set(userName, newConnection);        

    } catch (error) {
        logger.error('error in test init(): ', error);
        return Promise.reject(error);
    }
};

module.exports.run = function() {
    let transaction;
    let i= --testAssetNum;
    switch (testTransaction) {
    case 'RevokePermission':
        transaction = factory.newTransaction(base_ns, 'RevokePermission');
        transaction.asset = factory.newRelationship(base_ns, 'MedicalInfo', 'MedicalInfo_'+i );
        transaction.doctorId = 'Doctor_'+i ;       
        return  bc.bcObj.submitTransaction(busNetConnections.get('admin' ), transaction);

    case 'GivePermission': 
        transaction = factory.newTransaction(base_ns, 'GivePermission');
        transaction.asset = factory.newRelationship(base_ns, 'MedicalInfo', 'MedicalInfo_'+i );
        transaction.doctorId = 'Doctor_'+i ;  
        return  bc.bcObj.submitTransaction(busNetConnections.get('admin' ), transaction);
        // return  bc.bcObj.submitTransaction(busNetConnection, transaction);   
    default: 
        throw new Error('No valid test Transaction specified');
    }
};

module.exports.end = function() {
    return Promise.resolve(true);
};
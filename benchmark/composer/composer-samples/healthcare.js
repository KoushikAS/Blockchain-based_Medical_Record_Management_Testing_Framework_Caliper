'use strict';

const composerUtils = require('../../../src/adapters/composer/composer_utils');
const logger = require('../../../src/comm/util').getLogger('healthcare-network.js');
const os = require('os');
const uuid = os.hostname() + process.pid; // UUID for client within test

module.exports.info  = 'Healthcaare Network Performance Test';

let bc;
let busNetConnections;
let testAssetNum;
let factory;
const namespace = 'org.healthcare.basic';
const busNetName = 'healthcare';

module.exports.init = async function(blockchain, context, args) {
    // Create Participants and Assets to use in main test
    logger.debug('Inside test healthcare');

    bc = blockchain;
    busNetConnections = new Map();
    busNetConnections.set('admin', context);
    testAssetNum = args.testAssets;

    let doctorRegistry = await busNetConnections.get('admin').getParticipantRegistry(namespace + '.Doctor');
    let patientRegistry = await busNetConnections.get('admin').getParticipantRegistry(namespace + '.Patient');  
    let medicalInfoRegistry = await busNetConnections.get('admin').getAssetRegistry(namespace + '.MedicalInfo'); 
    let medicalInfos = new Array();

    try{
        factory = busNetConnections.get('admin').getBusinessNetwork().getFactory();

        // // Test specified number of Doctors
        // for (let i=0; i<testAssetNum; i++) {
        //     let doctor = factory.newResource(namespace, 'Doctor', 'Doctor_' + uuid + '_' + i);
        //     doctor.firstName = "doc";
        //     doctor.lastName = "Strange";
        //     doctor.specialist = "Magic";
        //     doctor.workExp = "5";
        //     doctor.hospital = "Avenger";
        //     doctor.phNo = "7777777777";
        //     await doctorRegistry.add(doctor);

        //     logger.debug('About to create new participant card');
        //     let userName = 'DoctorCard_' + uuid + '_' + i;
        //     let newConnection = await composerUtils.obtainConnectionForParticipant(busNetConnections.get('admin'), busNetName, doctor, userName);
        //     busNetConnections.set(userName, newConnection);
        // }

        // Create specified number of Patients
        // for (let i=0; i<testAssetNum; i++) {
            let patient = factory.newResource(namespace, 'Patient', 'Patient_' + uuid + '_0');
            patient.firstName = "Peter";
            patient.lastName = "Parker";
            patient.age = "18";
            patient.address = "NYU";
            patient.phNo = "8888888888";
            await patientRegistry.add(patient);

            logger.debug('About to create new patient card');
            let userName = 'PatientCard_' + uuid + '_0';
            let newConnection = await composerUtils.obtainConnectionForParticipant(busNetConnections.get('admin'), busNetName, patient, userName);
            busNetConnections.set(userName, newConnection);        
        // }
        logger.info("finsihed patient card");

        // Cretate  Medical Assets
        for (let i=0; i<testAssetNum; i++) {
            let medicalInfo = factory.newResource(namespace, 'MedicalInfo', 'MedicalInfo_' + uuid + '_' + i);
            medicalInfo.owner = factory.newRelationship(namespace, 'Patient', 'Patient_' + uuid + '_'+ i);
            medicalInfo.medication = 'Spider Bite Medicine';
            medicalInfo.pastVisitsArray = [];
            medicalInfo.permissionedDoctorsId = [];
            medicalInfos.push(medicalInfo);
        }
        
        logger.debug('Adding medical info');

        await medicalInfoRegistry.addAll(medicalInfos);
        logger.info("finsihed MedicalInfo");
        logger.info(medicalInfoRegistry)
    } catch(error){
        logger.error('error in test init():',error);
        return Promise.reject(error);
    }

};

module.exports.run = function() {

    //Transaction Give Permission

    // for (let i=0; i<testAssetNum; i++) {
        // logger.info("in run " );
        let transaction = factory.newTransaction(namespace, 'GivePermission');
        transaction.MedicalInfo = factory.newRelationship(namespace, 'MedicalInfo', 'MedicalInfo_' + uuid + '_0' );
        transaction.doctorId = 'Doctor_' + uuid + '_0' ;  
        logger.debug('GIVEPERMISSION:'+transaction)    
        return  bc.bcObj.submitTransaction(busNetConnections.get('PatientCard_' + uuid + '_0' ), transaction);
        // logger.info("out run "+i );
        // if(i%4 == 0){
        //     transaction.doctorId = 'Doctor_' + uuid + '_0' ;
        //     bc.bcObj.submitTransaction(busNetConnections.get('PatientCard_' + uuid + '_' + i), transaction);
        // }      
    // }

    // //Transaction Update Visit
    // for (let i=0; i<testAssetNum; i++) {
        // logger.info("Something " );
        // let transaction = factory.newTransaction(namespace, 'UpdateVisit');
        // transaction.MedicalInfo  = factory.newRelationship(namespace, 'MedicalInfo', 'MedicalInfo_' + uuid + '_' + 0);
        // transaction.procedure = "spider bite check";
        // transaction.medicationPrescribed = "spider bite medicine";
        // logger.info("before something" );
        // return bc.bcObj.submitTransaction(busNetConnections.get('DoctorCard_' + uuid + '_' + 0), transaction);
    // }

    // //Transaction Revoke Permission
    // for (let i=0; i<testAssetNum; i++) {
    //     if(i%5 == 0){
    //     let transaction = factory.newTransaction(namespace, 'RevokePermission');
    //     transaction.MedicalInfo = factory.newRelationship(namespace, 'MedicalInfo', 'MedicalInfo_' + uuid + '_' + i);
    //     transaction.doctorId = 'Doctor_' + uuid + '_' + i;
    //     bc.bcObj.submitTransaction(busNetConnections.get('PatientCard_' + uuid + '_' + i), transaction);
    //     }
    // }
    
};

module.exports.end = function() {
    return Promise.resolve(true);
};
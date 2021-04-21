'use strict';

// Initialize constants
const config = require('config');

// Initialize tearDown helpers
const multiCloudInit = require('../../../test/_common/processes/_multiCloudInit');
const b2cCustomerPurge = require('../../../test/_common/processes/_b2cCustomerPurge');
const b2cCRMSyncConfigManager = require('../../../test/_common/processes/_b2cCRMSyncConfigManager');

/**
 * @function useCaseTestInit
 * @description Helper function to centralize the initialization logic leveraged by the
 * multi-cloud unit tests included in b2c-crm-sync.
 *
 * @param {Object} environmentDef Represents the current development environment being processes
 * @param {String} siteId Represents the B2C Commerce site used to initialize b2c-crm-sync
 * @return {Promise} Returns the output result from the test initialization
 */
module.exports = async (environmentDef, siteId) => {

    // Initialize local Variables
    let syncDisableConfig,
        output;

    // Retrieve the default / base-configuration used disable b2c-crm-sync via OCAPI
    syncDisableConfig = config.util.toObject(config.get('unitTests.b2cCRMSyncConfigManager.disableOCAPI'));

    // Default the output variable
    output = {};

    // Initialize and retrieve the administrative authTokens
    output.multiCloudInitResults = await multiCloudInit(environmentDef);

    // Purge the customer data in B2C Commerce and SFDC
    await b2cCustomerPurge(output.multiCloudInitResults.b2cAdminAuthToken, output.multiCloudInitResults.sfdcAuthCredentials.conn);

    // Ensure that b2c-crm-sync is disabled in the specified environment
    await b2cCRMSyncConfigManager(environmentDef, output.multiCloudInitResults.b2cAdminAuthToken, siteId, syncDisableConfig);

    // Return the output variable
    return output;

};

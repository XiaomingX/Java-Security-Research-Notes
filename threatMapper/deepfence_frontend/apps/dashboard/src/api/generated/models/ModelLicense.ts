/* tslint:disable */
/* eslint-disable */
/**
 * Deepfence ThreatMapper
 * Deepfence Runtime API provides programmatic control over Deepfence microservice securing your container, kubernetes and cloud deployments. The API abstracts away underlying infrastructure details like cloud provider,  container distros, container orchestrator and type of deployment. This is one uniform API to manage and control security alerts, policies and response to alerts for microservices running anywhere i.e. managed pure greenfield container deployments or a mix of containers, VMs and serverless paradigms like AWS Fargate.
 *
 * The version of the OpenAPI document: v2.3.0
 * Contact: community@deepfence.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { ModelRegistryCredentials } from './ModelRegistryCredentials';
import {
    ModelRegistryCredentialsFromJSON,
    ModelRegistryCredentialsFromJSONTyped,
    ModelRegistryCredentialsToJSON,
} from './ModelRegistryCredentials';

/**
 * 
 * @export
 * @interface ModelLicense
 */
export interface ModelLicense {
    /**
     * 
     * @type {number}
     * @memberof ModelLicense
     */
    current_hosts?: number;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    deepfence_support_email?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    end_date?: string;
    /**
     * 
     * @type {boolean}
     * @memberof ModelLicense
     */
    is_active?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    key?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    license_email?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    license_email_domain?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    license_type?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    message?: string;
    /**
     * 
     * @type {number}
     * @memberof ModelLicense
     */
    no_of_cloud_accounts?: number;
    /**
     * 
     * @type {number}
     * @memberof ModelLicense
     */
    no_of_hosts?: number;
    /**
     * 
     * @type {number}
     * @memberof ModelLicense
     */
    no_of_images_in_registry?: number;
    /**
     * 
     * @type {number}
     * @memberof ModelLicense
     */
    no_of_registries?: number;
    /**
     * 
     * @type {number}
     * @memberof ModelLicense
     */
    notification_threshold_percentage?: number;
    /**
     * 
     * @type {number}
     * @memberof ModelLicense
     */
    notification_threshold_updated_at?: number;
    /**
     * 
     * @type {ModelRegistryCredentials}
     * @memberof ModelLicense
     */
    registry_credentials?: ModelRegistryCredentials;
    /**
     * 
     * @type {string}
     * @memberof ModelLicense
     */
    start_date?: string;
}

/**
 * Check if a given object implements the ModelLicense interface.
 */
export function instanceOfModelLicense(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ModelLicenseFromJSON(json: any): ModelLicense {
    return ModelLicenseFromJSONTyped(json, false);
}

export function ModelLicenseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelLicense {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'current_hosts': !exists(json, 'current_hosts') ? undefined : json['current_hosts'],
        'deepfence_support_email': !exists(json, 'deepfence_support_email') ? undefined : json['deepfence_support_email'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'end_date': !exists(json, 'end_date') ? undefined : json['end_date'],
        'is_active': !exists(json, 'is_active') ? undefined : json['is_active'],
        'key': !exists(json, 'key') ? undefined : json['key'],
        'license_email': !exists(json, 'license_email') ? undefined : json['license_email'],
        'license_email_domain': !exists(json, 'license_email_domain') ? undefined : json['license_email_domain'],
        'license_type': !exists(json, 'license_type') ? undefined : json['license_type'],
        'message': !exists(json, 'message') ? undefined : json['message'],
        'no_of_cloud_accounts': !exists(json, 'no_of_cloud_accounts') ? undefined : json['no_of_cloud_accounts'],
        'no_of_hosts': !exists(json, 'no_of_hosts') ? undefined : json['no_of_hosts'],
        'no_of_images_in_registry': !exists(json, 'no_of_images_in_registry') ? undefined : json['no_of_images_in_registry'],
        'no_of_registries': !exists(json, 'no_of_registries') ? undefined : json['no_of_registries'],
        'notification_threshold_percentage': !exists(json, 'notification_threshold_percentage') ? undefined : json['notification_threshold_percentage'],
        'notification_threshold_updated_at': !exists(json, 'notification_threshold_updated_at') ? undefined : json['notification_threshold_updated_at'],
        'registry_credentials': !exists(json, 'registry_credentials') ? undefined : ModelRegistryCredentialsFromJSON(json['registry_credentials']),
        'start_date': !exists(json, 'start_date') ? undefined : json['start_date'],
    };
}

export function ModelLicenseToJSON(value?: ModelLicense | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'current_hosts': value.current_hosts,
        'deepfence_support_email': value.deepfence_support_email,
        'description': value.description,
        'end_date': value.end_date,
        'is_active': value.is_active,
        'key': value.key,
        'license_email': value.license_email,
        'license_email_domain': value.license_email_domain,
        'license_type': value.license_type,
        'message': value.message,
        'no_of_cloud_accounts': value.no_of_cloud_accounts,
        'no_of_hosts': value.no_of_hosts,
        'no_of_images_in_registry': value.no_of_images_in_registry,
        'no_of_registries': value.no_of_registries,
        'notification_threshold_percentage': value.notification_threshold_percentage,
        'notification_threshold_updated_at': value.notification_threshold_updated_at,
        'registry_credentials': ModelRegistryCredentialsToJSON(value.registry_credentials),
        'start_date': value.start_date,
    };
}

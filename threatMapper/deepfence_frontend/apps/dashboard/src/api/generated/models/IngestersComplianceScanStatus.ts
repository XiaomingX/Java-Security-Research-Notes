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
/**
 * 
 * @export
 * @interface IngestersComplianceScanStatus
 */
export interface IngestersComplianceScanStatus {
    /**
     * 
     * @type {string}
     * @memberof IngestersComplianceScanStatus
     */
    scan_id?: string;
    /**
     * 
     * @type {string}
     * @memberof IngestersComplianceScanStatus
     */
    scan_message?: string;
    /**
     * 
     * @type {string}
     * @memberof IngestersComplianceScanStatus
     */
    scan_status?: string;
}

/**
 * Check if a given object implements the IngestersComplianceScanStatus interface.
 */
export function instanceOfIngestersComplianceScanStatus(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function IngestersComplianceScanStatusFromJSON(json: any): IngestersComplianceScanStatus {
    return IngestersComplianceScanStatusFromJSONTyped(json, false);
}

export function IngestersComplianceScanStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): IngestersComplianceScanStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'scan_id': !exists(json, 'scan_id') ? undefined : json['scan_id'],
        'scan_message': !exists(json, 'scan_message') ? undefined : json['scan_message'],
        'scan_status': !exists(json, 'scan_status') ? undefined : json['scan_status'],
    };
}

export function IngestersComplianceScanStatusToJSON(value?: IngestersComplianceScanStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'scan_id': value.scan_id,
        'scan_message': value.scan_message,
        'scan_status': value.scan_status,
    };
}

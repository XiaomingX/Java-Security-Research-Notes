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
 * @interface ModelExportReport
 */
export interface ModelExportReport {
    /**
     * 
     * @type {number}
     * @memberof ModelExportReport
     */
    created_at?: number;
    /**
     * 
     * @type {string}
     * @memberof ModelExportReport
     */
    filters?: string;
    /**
     * 
     * @type {number}
     * @memberof ModelExportReport
     */
    from_timestamp?: number;
    /**
     * 
     * @type {string}
     * @memberof ModelExportReport
     */
    report_id?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelExportReport
     */
    status?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelExportReport
     */
    status_message?: string;
    /**
     * 
     * @type {string}
     * @memberof ModelExportReport
     */
    storage_path?: string;
    /**
     * 
     * @type {number}
     * @memberof ModelExportReport
     */
    to_timestamp?: number;
    /**
     * 
     * @type {string}
     * @memberof ModelExportReport
     */
    type?: string;
    /**
     * 
     * @type {number}
     * @memberof ModelExportReport
     */
    updated_at?: number;
    /**
     * 
     * @type {string}
     * @memberof ModelExportReport
     */
    url?: string;
}

/**
 * Check if a given object implements the ModelExportReport interface.
 */
export function instanceOfModelExportReport(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ModelExportReportFromJSON(json: any): ModelExportReport {
    return ModelExportReportFromJSONTyped(json, false);
}

export function ModelExportReportFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelExportReport {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'created_at': !exists(json, 'created_at') ? undefined : json['created_at'],
        'filters': !exists(json, 'filters') ? undefined : json['filters'],
        'from_timestamp': !exists(json, 'from_timestamp') ? undefined : json['from_timestamp'],
        'report_id': !exists(json, 'report_id') ? undefined : json['report_id'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'status_message': !exists(json, 'status_message') ? undefined : json['status_message'],
        'storage_path': !exists(json, 'storage_path') ? undefined : json['storage_path'],
        'to_timestamp': !exists(json, 'to_timestamp') ? undefined : json['to_timestamp'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'updated_at': !exists(json, 'updated_at') ? undefined : json['updated_at'],
        'url': !exists(json, 'url') ? undefined : json['url'],
    };
}

export function ModelExportReportToJSON(value?: ModelExportReport | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'created_at': value.created_at,
        'filters': value.filters,
        'from_timestamp': value.from_timestamp,
        'report_id': value.report_id,
        'status': value.status,
        'status_message': value.status_message,
        'storage_path': value.storage_path,
        'to_timestamp': value.to_timestamp,
        'type': value.type,
        'updated_at': value.updated_at,
        'url': value.url,
    };
}

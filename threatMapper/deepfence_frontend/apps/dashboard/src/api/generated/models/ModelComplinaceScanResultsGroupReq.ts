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
import type { ReportersFieldsFilters } from './ReportersFieldsFilters';
import {
    ReportersFieldsFiltersFromJSON,
    ReportersFieldsFiltersFromJSONTyped,
    ReportersFieldsFiltersToJSON,
} from './ReportersFieldsFilters';

/**
 * 
 * @export
 * @interface ModelComplinaceScanResultsGroupReq
 */
export interface ModelComplinaceScanResultsGroupReq {
    /**
     * 
     * @type {ReportersFieldsFilters}
     * @memberof ModelComplinaceScanResultsGroupReq
     */
    fields_filter: ReportersFieldsFilters;
    /**
     * 
     * @type {string}
     * @memberof ModelComplinaceScanResultsGroupReq
     */
    scan_id: string;
}

/**
 * Check if a given object implements the ModelComplinaceScanResultsGroupReq interface.
 */
export function instanceOfModelComplinaceScanResultsGroupReq(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "fields_filter" in value;
    isInstance = isInstance && "scan_id" in value;

    return isInstance;
}

export function ModelComplinaceScanResultsGroupReqFromJSON(json: any): ModelComplinaceScanResultsGroupReq {
    return ModelComplinaceScanResultsGroupReqFromJSONTyped(json, false);
}

export function ModelComplinaceScanResultsGroupReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelComplinaceScanResultsGroupReq {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fields_filter': ReportersFieldsFiltersFromJSON(json['fields_filter']),
        'scan_id': json['scan_id'],
    };
}

export function ModelComplinaceScanResultsGroupReqToJSON(value?: ModelComplinaceScanResultsGroupReq | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'fields_filter': ReportersFieldsFiltersToJSON(value.fields_filter),
        'scan_id': value.scan_id,
    };
}


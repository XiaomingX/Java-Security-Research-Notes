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
 * @interface UtilsAdvancedReportFilters
 */
export interface UtilsAdvancedReportFilters {
    /**
     * 
     * @type {Array<string>}
     * @memberof UtilsAdvancedReportFilters
     */
    container_name?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UtilsAdvancedReportFilters
     */
    host_name?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UtilsAdvancedReportFilters
     */
    image_name?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UtilsAdvancedReportFilters
     */
    kubernetes_cluster_name?: Array<string>;
    /**
     * 
     * @type {Array<boolean>}
     * @memberof UtilsAdvancedReportFilters
     */
    masked?: Array<boolean>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UtilsAdvancedReportFilters
     */
    node_id?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UtilsAdvancedReportFilters
     */
    pod_name?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UtilsAdvancedReportFilters
     */
    scan_status?: Array<string>;
}

/**
 * Check if a given object implements the UtilsAdvancedReportFilters interface.
 */
export function instanceOfUtilsAdvancedReportFilters(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UtilsAdvancedReportFiltersFromJSON(json: any): UtilsAdvancedReportFilters {
    return UtilsAdvancedReportFiltersFromJSONTyped(json, false);
}

export function UtilsAdvancedReportFiltersFromJSONTyped(json: any, ignoreDiscriminator: boolean): UtilsAdvancedReportFilters {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'container_name': !exists(json, 'container_name') ? undefined : json['container_name'],
        'host_name': !exists(json, 'host_name') ? undefined : json['host_name'],
        'image_name': !exists(json, 'image_name') ? undefined : json['image_name'],
        'kubernetes_cluster_name': !exists(json, 'kubernetes_cluster_name') ? undefined : json['kubernetes_cluster_name'],
        'masked': !exists(json, 'masked') ? undefined : json['masked'],
        'node_id': !exists(json, 'node_id') ? undefined : json['node_id'],
        'pod_name': !exists(json, 'pod_name') ? undefined : json['pod_name'],
        'scan_status': !exists(json, 'scan_status') ? undefined : json['scan_status'],
    };
}

export function UtilsAdvancedReportFiltersToJSON(value?: UtilsAdvancedReportFilters | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'container_name': value.container_name,
        'host_name': value.host_name,
        'image_name': value.image_name,
        'kubernetes_cluster_name': value.kubernetes_cluster_name,
        'masked': value.masked,
        'node_id': value.node_id,
        'pod_name': value.pod_name,
        'scan_status': value.scan_status,
    };
}

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
 * @interface DiagnosisDiagnosticLogsStatus
 */
export interface DiagnosisDiagnosticLogsStatus {
    /**
     * 
     * @type {string}
     * @memberof DiagnosisDiagnosticLogsStatus
     */
    message?: string;
    /**
     * 
     * @type {string}
     * @memberof DiagnosisDiagnosticLogsStatus
     */
    status: string;
}

/**
 * Check if a given object implements the DiagnosisDiagnosticLogsStatus interface.
 */
export function instanceOfDiagnosisDiagnosticLogsStatus(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "status" in value;

    return isInstance;
}

export function DiagnosisDiagnosticLogsStatusFromJSON(json: any): DiagnosisDiagnosticLogsStatus {
    return DiagnosisDiagnosticLogsStatusFromJSONTyped(json, false);
}

export function DiagnosisDiagnosticLogsStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): DiagnosisDiagnosticLogsStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'message': !exists(json, 'message') ? undefined : json['message'],
        'status': json['status'],
    };
}

export function DiagnosisDiagnosticLogsStatusToJSON(value?: DiagnosisDiagnosticLogsStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'message': value.message,
        'status': value.status,
    };
}

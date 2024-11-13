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
 * @interface ModelDeleteIntegrationReq
 */
export interface ModelDeleteIntegrationReq {
    /**
     * 
     * @type {Array<number>}
     * @memberof ModelDeleteIntegrationReq
     */
    integration_ids: Array<number> | null;
}

/**
 * Check if a given object implements the ModelDeleteIntegrationReq interface.
 */
export function instanceOfModelDeleteIntegrationReq(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "integration_ids" in value;

    return isInstance;
}

export function ModelDeleteIntegrationReqFromJSON(json: any): ModelDeleteIntegrationReq {
    return ModelDeleteIntegrationReqFromJSONTyped(json, false);
}

export function ModelDeleteIntegrationReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelDeleteIntegrationReq {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'integration_ids': json['integration_ids'],
    };
}

export function ModelDeleteIntegrationReqToJSON(value?: ModelDeleteIntegrationReq | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'integration_ids': value.integration_ids,
    };
}

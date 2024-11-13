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
 * @interface ModelUpdateUserPasswordRequest
 */
export interface ModelUpdateUserPasswordRequest {
    /**
     * 
     * @type {string}
     * @memberof ModelUpdateUserPasswordRequest
     */
    new_password: string;
    /**
     * 
     * @type {string}
     * @memberof ModelUpdateUserPasswordRequest
     */
    old_password: string;
}

/**
 * Check if a given object implements the ModelUpdateUserPasswordRequest interface.
 */
export function instanceOfModelUpdateUserPasswordRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "new_password" in value;
    isInstance = isInstance && "old_password" in value;

    return isInstance;
}

export function ModelUpdateUserPasswordRequestFromJSON(json: any): ModelUpdateUserPasswordRequest {
    return ModelUpdateUserPasswordRequestFromJSONTyped(json, false);
}

export function ModelUpdateUserPasswordRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelUpdateUserPasswordRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'new_password': json['new_password'],
        'old_password': json['old_password'],
    };
}

export function ModelUpdateUserPasswordRequestToJSON(value?: ModelUpdateUserPasswordRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'new_password': value.new_password,
        'old_password': value.old_password,
    };
}


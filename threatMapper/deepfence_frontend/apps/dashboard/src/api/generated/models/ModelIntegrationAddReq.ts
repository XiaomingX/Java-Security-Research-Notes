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
import type { ModelIntegrationFilters } from './ModelIntegrationFilters';
import {
    ModelIntegrationFiltersFromJSON,
    ModelIntegrationFiltersFromJSONTyped,
    ModelIntegrationFiltersToJSON,
} from './ModelIntegrationFilters';

/**
 * 
 * @export
 * @interface ModelIntegrationAddReq
 */
export interface ModelIntegrationAddReq {
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof ModelIntegrationAddReq
     */
    config?: { [key: string]: any; } | null;
    /**
     * 
     * @type {ModelIntegrationFilters}
     * @memberof ModelIntegrationAddReq
     */
    filters?: ModelIntegrationFilters;
    /**
     * 
     * @type {string}
     * @memberof ModelIntegrationAddReq
     */
    integration_type: string;
    /**
     * 
     * @type {string}
     * @memberof ModelIntegrationAddReq
     */
    notification_type: string;
    /**
     * 
     * @type {boolean}
     * @memberof ModelIntegrationAddReq
     */
    send_summary?: boolean;
}

/**
 * Check if a given object implements the ModelIntegrationAddReq interface.
 */
export function instanceOfModelIntegrationAddReq(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "integration_type" in value;
    isInstance = isInstance && "notification_type" in value;

    return isInstance;
}

export function ModelIntegrationAddReqFromJSON(json: any): ModelIntegrationAddReq {
    return ModelIntegrationAddReqFromJSONTyped(json, false);
}

export function ModelIntegrationAddReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelIntegrationAddReq {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'config': !exists(json, 'config') ? undefined : json['config'],
        'filters': !exists(json, 'filters') ? undefined : ModelIntegrationFiltersFromJSON(json['filters']),
        'integration_type': json['integration_type'],
        'notification_type': json['notification_type'],
        'send_summary': !exists(json, 'send_summary') ? undefined : json['send_summary'],
    };
}

export function ModelIntegrationAddReqToJSON(value?: ModelIntegrationAddReq | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'config': value.config,
        'filters': ModelIntegrationFiltersToJSON(value.filters),
        'integration_type': value.integration_type,
        'notification_type': value.notification_type,
        'send_summary': value.send_summary,
    };
}

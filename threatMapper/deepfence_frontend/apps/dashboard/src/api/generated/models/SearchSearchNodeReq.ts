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
import type { ModelFetchWindow } from './ModelFetchWindow';
import {
    ModelFetchWindowFromJSON,
    ModelFetchWindowFromJSONTyped,
    ModelFetchWindowToJSON,
} from './ModelFetchWindow';
import type { SearchChainedSearchFilter } from './SearchChainedSearchFilter';
import {
    SearchChainedSearchFilterFromJSON,
    SearchChainedSearchFilterFromJSONTyped,
    SearchChainedSearchFilterToJSON,
} from './SearchChainedSearchFilter';
import type { SearchSearchFilter } from './SearchSearchFilter';
import {
    SearchSearchFilterFromJSON,
    SearchSearchFilterFromJSONTyped,
    SearchSearchFilterToJSON,
} from './SearchSearchFilter';

/**
 * 
 * @export
 * @interface SearchSearchNodeReq
 */
export interface SearchSearchNodeReq {
    /**
     * 
     * @type {SearchSearchFilter}
     * @memberof SearchSearchNodeReq
     */
    extended_node_filter?: SearchSearchFilter;
    /**
     * 
     * @type {SearchSearchFilter}
     * @memberof SearchSearchNodeReq
     */
    node_filter: SearchSearchFilter;
    /**
     * 
     * @type {SearchChainedSearchFilter}
     * @memberof SearchSearchNodeReq
     */
    related_node_filter?: SearchChainedSearchFilter;
    /**
     * 
     * @type {ModelFetchWindow}
     * @memberof SearchSearchNodeReq
     */
    window: ModelFetchWindow;
}

/**
 * Check if a given object implements the SearchSearchNodeReq interface.
 */
export function instanceOfSearchSearchNodeReq(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "node_filter" in value;
    isInstance = isInstance && "window" in value;

    return isInstance;
}

export function SearchSearchNodeReqFromJSON(json: any): SearchSearchNodeReq {
    return SearchSearchNodeReqFromJSONTyped(json, false);
}

export function SearchSearchNodeReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchSearchNodeReq {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'extended_node_filter': !exists(json, 'extended_node_filter') ? undefined : SearchSearchFilterFromJSON(json['extended_node_filter']),
        'node_filter': SearchSearchFilterFromJSON(json['node_filter']),
        'related_node_filter': !exists(json, 'related_node_filter') ? undefined : SearchChainedSearchFilterFromJSON(json['related_node_filter']),
        'window': ModelFetchWindowFromJSON(json['window']),
    };
}

export function SearchSearchNodeReqToJSON(value?: SearchSearchNodeReq | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'extended_node_filter': SearchSearchFilterToJSON(value.extended_node_filter),
        'node_filter': SearchSearchFilterToJSON(value.node_filter),
        'related_node_filter': SearchChainedSearchFilterToJSON(value.related_node_filter),
        'window': ModelFetchWindowToJSON(value.window),
    };
}

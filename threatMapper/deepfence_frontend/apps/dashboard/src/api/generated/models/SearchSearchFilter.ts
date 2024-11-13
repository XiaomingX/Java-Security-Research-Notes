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
import type { ReportersFieldsFilters } from './ReportersFieldsFilters';
import {
    ReportersFieldsFiltersFromJSON,
    ReportersFieldsFiltersFromJSONTyped,
    ReportersFieldsFiltersToJSON,
} from './ReportersFieldsFilters';

/**
 * 
 * @export
 * @interface SearchSearchFilter
 */
export interface SearchSearchFilter {
    /**
     * 
     * @type {ReportersFieldsFilters}
     * @memberof SearchSearchFilter
     */
    filters: ReportersFieldsFilters;
    /**
     * 
     * @type {Array<string>}
     * @memberof SearchSearchFilter
     */
    in_field_filter: Array<string> | null;
    /**
     * 
     * @type {ModelFetchWindow}
     * @memberof SearchSearchFilter
     */
    window: ModelFetchWindow;
}

/**
 * Check if a given object implements the SearchSearchFilter interface.
 */
export function instanceOfSearchSearchFilter(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "filters" in value;
    isInstance = isInstance && "in_field_filter" in value;
    isInstance = isInstance && "window" in value;

    return isInstance;
}

export function SearchSearchFilterFromJSON(json: any): SearchSearchFilter {
    return SearchSearchFilterFromJSONTyped(json, false);
}

export function SearchSearchFilterFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchSearchFilter {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'filters': ReportersFieldsFiltersFromJSON(json['filters']),
        'in_field_filter': json['in_field_filter'],
        'window': ModelFetchWindowFromJSON(json['window']),
    };
}

export function SearchSearchFilterToJSON(value?: SearchSearchFilter | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'filters': ReportersFieldsFiltersToJSON(value.filters),
        'in_field_filter': value.in_field_filter,
        'window': ModelFetchWindowToJSON(value.window),
    };
}

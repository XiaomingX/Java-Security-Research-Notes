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


import * as runtime from '../runtime';
import type {
  ApiDocsBadRequestResponse,
  ApiDocsFailureResponse,
  ModelAddGenerativeAiBedrockIntegration,
  ModelAddGenerativeAiOpenAIIntegration,
  ModelGenerativeAiIntegrationCloudPostureRequest,
  ModelGenerativeAiIntegrationKubernetesPostureRequest,
  ModelGenerativeAiIntegrationLinuxPostureRequest,
  ModelGenerativeAiIntegrationListResponse,
  ModelGenerativeAiIntegrationMalwareRequest,
  ModelGenerativeAiIntegrationSecretRequest,
  ModelGenerativeAiIntegrationVulnerabilityRequest,
  ModelMessageResponse,
} from '../models';
import {
    ApiDocsBadRequestResponseFromJSON,
    ApiDocsBadRequestResponseToJSON,
    ApiDocsFailureResponseFromJSON,
    ApiDocsFailureResponseToJSON,
    ModelAddGenerativeAiBedrockIntegrationFromJSON,
    ModelAddGenerativeAiBedrockIntegrationToJSON,
    ModelAddGenerativeAiOpenAIIntegrationFromJSON,
    ModelAddGenerativeAiOpenAIIntegrationToJSON,
    ModelGenerativeAiIntegrationCloudPostureRequestFromJSON,
    ModelGenerativeAiIntegrationCloudPostureRequestToJSON,
    ModelGenerativeAiIntegrationKubernetesPostureRequestFromJSON,
    ModelGenerativeAiIntegrationKubernetesPostureRequestToJSON,
    ModelGenerativeAiIntegrationLinuxPostureRequestFromJSON,
    ModelGenerativeAiIntegrationLinuxPostureRequestToJSON,
    ModelGenerativeAiIntegrationListResponseFromJSON,
    ModelGenerativeAiIntegrationListResponseToJSON,
    ModelGenerativeAiIntegrationMalwareRequestFromJSON,
    ModelGenerativeAiIntegrationMalwareRequestToJSON,
    ModelGenerativeAiIntegrationSecretRequestFromJSON,
    ModelGenerativeAiIntegrationSecretRequestToJSON,
    ModelGenerativeAiIntegrationVulnerabilityRequestFromJSON,
    ModelGenerativeAiIntegrationVulnerabilityRequestToJSON,
    ModelMessageResponseFromJSON,
    ModelMessageResponseToJSON,
} from '../models';

export interface AddGenerativeAiIntegrationBedrockRequest {
    modelAddGenerativeAiBedrockIntegration?: ModelAddGenerativeAiBedrockIntegration;
}

export interface AddGenerativeAiIntegrationOpenAIRequest {
    modelAddGenerativeAiOpenAIIntegration?: ModelAddGenerativeAiOpenAIIntegration;
}

export interface DeleteGenerativeAiIntegrationRequest {
    integrationId: string;
}

export interface GenerativeAiIntegrationCloudPostureQueryRequest {
    modelGenerativeAiIntegrationCloudPostureRequest?: ModelGenerativeAiIntegrationCloudPostureRequest;
}

export interface GenerativeAiIntegrationKubernetesPostureQueryRequest {
    modelGenerativeAiIntegrationKubernetesPostureRequest?: ModelGenerativeAiIntegrationKubernetesPostureRequest;
}

export interface GenerativeAiIntegrationLinuxPostureQueryRequest {
    modelGenerativeAiIntegrationLinuxPostureRequest?: ModelGenerativeAiIntegrationLinuxPostureRequest;
}

export interface GenerativeAiIntegrationMalwareQueryRequest {
    modelGenerativeAiIntegrationMalwareRequest?: ModelGenerativeAiIntegrationMalwareRequest;
}

export interface GenerativeAiIntegrationSecretQueryRequest {
    modelGenerativeAiIntegrationSecretRequest?: ModelGenerativeAiIntegrationSecretRequest;
}

export interface GenerativeAiIntegrationVulnerabilityQueryRequest {
    modelGenerativeAiIntegrationVulnerabilityRequest?: ModelGenerativeAiIntegrationVulnerabilityRequest;
}

export interface ListGenerativeAiIntegrationRequest {
    integrationType?: ListGenerativeAiIntegrationIntegrationTypeEnum;
}

export interface SetDefaultGenerativeAiIntegrationRequest {
    integrationId: string;
}

/**
 * GenerativeAIApi - interface
 * 
 * @export
 * @interface GenerativeAIApiInterface
 */
export interface GenerativeAIApiInterface {
    /**
     * Add a new AWS Bedrock Generative AI Integration
     * @summary Add AWS Bedrock Generative AI Integration
     * @param {ModelAddGenerativeAiBedrockIntegration} [modelAddGenerativeAiBedrockIntegration] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    addGenerativeAiIntegrationBedrockRaw(requestParameters: AddGenerativeAiIntegrationBedrockRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModelMessageResponse>>;

    /**
     * Add a new AWS Bedrock Generative AI Integration
     * Add AWS Bedrock Generative AI Integration
     */
    addGenerativeAiIntegrationBedrock(requestParameters: AddGenerativeAiIntegrationBedrockRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModelMessageResponse>;

    /**
     * Add a new OpenAI Generative AI Integration
     * @summary Add OpenAI Generative AI Integration
     * @param {ModelAddGenerativeAiOpenAIIntegration} [modelAddGenerativeAiOpenAIIntegration] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    addGenerativeAiIntegrationOpenAIRaw(requestParameters: AddGenerativeAiIntegrationOpenAIRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModelMessageResponse>>;

    /**
     * Add a new OpenAI Generative AI Integration
     * Add OpenAI Generative AI Integration
     */
    addGenerativeAiIntegrationOpenAI(requestParameters: AddGenerativeAiIntegrationOpenAIRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModelMessageResponse>;

    /**
     * Automatically add Generative AI Integrations using IAM role
     * @summary Automatically add Generative AI Integration
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    autoAddGenerativeAiIntegrationRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Automatically add Generative AI Integrations using IAM role
     * Automatically add Generative AI Integration
     */
    autoAddGenerativeAiIntegration(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Delete Generative AI integration
     * @summary Delete Generative AI Integration
     * @param {string} integrationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    deleteGenerativeAiIntegrationRaw(requestParameters: DeleteGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Delete Generative AI integration
     * Delete Generative AI Integration
     */
    deleteGenerativeAiIntegration(requestParameters: DeleteGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Send Cloud Posture query to Generative AI Integration
     * @summary Send Cloud Posture query to Generative AI Integration
     * @param {ModelGenerativeAiIntegrationCloudPostureRequest} [modelGenerativeAiIntegrationCloudPostureRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    generativeAiIntegrationCloudPostureQueryRaw(requestParameters: GenerativeAiIntegrationCloudPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Send Cloud Posture query to Generative AI Integration
     * Send Cloud Posture query to Generative AI Integration
     */
    generativeAiIntegrationCloudPostureQuery(requestParameters: GenerativeAiIntegrationCloudPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Send Kubernetes Posture query to Generative AI Integration
     * @summary Send Kubernetes Posture query to Generative AI Integration
     * @param {ModelGenerativeAiIntegrationKubernetesPostureRequest} [modelGenerativeAiIntegrationKubernetesPostureRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    generativeAiIntegrationKubernetesPostureQueryRaw(requestParameters: GenerativeAiIntegrationKubernetesPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Send Kubernetes Posture query to Generative AI Integration
     * Send Kubernetes Posture query to Generative AI Integration
     */
    generativeAiIntegrationKubernetesPostureQuery(requestParameters: GenerativeAiIntegrationKubernetesPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Send Linux Posture query to Generative AI Integration
     * @summary Send Linux Posture query to Generative AI Integration
     * @param {ModelGenerativeAiIntegrationLinuxPostureRequest} [modelGenerativeAiIntegrationLinuxPostureRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    generativeAiIntegrationLinuxPostureQueryRaw(requestParameters: GenerativeAiIntegrationLinuxPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Send Linux Posture query to Generative AI Integration
     * Send Linux Posture query to Generative AI Integration
     */
    generativeAiIntegrationLinuxPostureQuery(requestParameters: GenerativeAiIntegrationLinuxPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Send Malware query to Generative AI Integration
     * @summary Send Malware query to Generative AI Integration
     * @param {ModelGenerativeAiIntegrationMalwareRequest} [modelGenerativeAiIntegrationMalwareRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    generativeAiIntegrationMalwareQueryRaw(requestParameters: GenerativeAiIntegrationMalwareQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Send Malware query to Generative AI Integration
     * Send Malware query to Generative AI Integration
     */
    generativeAiIntegrationMalwareQuery(requestParameters: GenerativeAiIntegrationMalwareQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Send Secret query to Generative AI Integration
     * @summary Send Secret query to Generative AI Integration
     * @param {ModelGenerativeAiIntegrationSecretRequest} [modelGenerativeAiIntegrationSecretRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    generativeAiIntegrationSecretQueryRaw(requestParameters: GenerativeAiIntegrationSecretQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Send Secret query to Generative AI Integration
     * Send Secret query to Generative AI Integration
     */
    generativeAiIntegrationSecretQuery(requestParameters: GenerativeAiIntegrationSecretQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Send Vulnerability query to Generative AI Integration
     * @summary Send Vulnerability query to Generative AI Integration
     * @param {ModelGenerativeAiIntegrationVulnerabilityRequest} [modelGenerativeAiIntegrationVulnerabilityRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    generativeAiIntegrationVulnerabilityQueryRaw(requestParameters: GenerativeAiIntegrationVulnerabilityQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Send Vulnerability query to Generative AI Integration
     * Send Vulnerability query to Generative AI Integration
     */
    generativeAiIntegrationVulnerabilityQuery(requestParameters: GenerativeAiIntegrationVulnerabilityQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * List all the added Generative AI Integrations
     * @summary List Generative AI Integrations
     * @param {'openai' | 'amazon-bedrock'} [integrationType] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    listGenerativeAiIntegrationRaw(requestParameters: ListGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ModelGenerativeAiIntegrationListResponse>>>;

    /**
     * List all the added Generative AI Integrations
     * List Generative AI Integrations
     */
    listGenerativeAiIntegration(requestParameters: ListGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ModelGenerativeAiIntegrationListResponse>>;

    /**
     * Set Default Generative AI integration
     * @summary Set Default Generative AI Integration
     * @param {string} integrationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerativeAIApiInterface
     */
    setDefaultGenerativeAiIntegrationRaw(requestParameters: SetDefaultGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Set Default Generative AI integration
     * Set Default Generative AI Integration
     */
    setDefaultGenerativeAiIntegration(requestParameters: SetDefaultGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

}

/**
 * 
 */
export class GenerativeAIApi extends runtime.BaseAPI implements GenerativeAIApiInterface {

    /**
     * Add a new AWS Bedrock Generative AI Integration
     * Add AWS Bedrock Generative AI Integration
     */
    async addGenerativeAiIntegrationBedrockRaw(requestParameters: AddGenerativeAiIntegrationBedrockRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModelMessageResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/bedrock`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelAddGenerativeAiBedrockIntegrationToJSON(requestParameters.modelAddGenerativeAiBedrockIntegration),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ModelMessageResponseFromJSON(jsonValue));
    }

    /**
     * Add a new AWS Bedrock Generative AI Integration
     * Add AWS Bedrock Generative AI Integration
     */
    async addGenerativeAiIntegrationBedrock(requestParameters: AddGenerativeAiIntegrationBedrockRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModelMessageResponse> {
        const response = await this.addGenerativeAiIntegrationBedrockRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Add a new OpenAI Generative AI Integration
     * Add OpenAI Generative AI Integration
     */
    async addGenerativeAiIntegrationOpenAIRaw(requestParameters: AddGenerativeAiIntegrationOpenAIRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModelMessageResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/openai`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelAddGenerativeAiOpenAIIntegrationToJSON(requestParameters.modelAddGenerativeAiOpenAIIntegration),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ModelMessageResponseFromJSON(jsonValue));
    }

    /**
     * Add a new OpenAI Generative AI Integration
     * Add OpenAI Generative AI Integration
     */
    async addGenerativeAiIntegrationOpenAI(requestParameters: AddGenerativeAiIntegrationOpenAIRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModelMessageResponse> {
        const response = await this.addGenerativeAiIntegrationOpenAIRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Automatically add Generative AI Integrations using IAM role
     * Automatically add Generative AI Integration
     */
    async autoAddGenerativeAiIntegrationRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/auto-add`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Automatically add Generative AI Integrations using IAM role
     * Automatically add Generative AI Integration
     */
    async autoAddGenerativeAiIntegration(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.autoAddGenerativeAiIntegrationRaw(initOverrides);
    }

    /**
     * Delete Generative AI integration
     * Delete Generative AI Integration
     */
    async deleteGenerativeAiIntegrationRaw(requestParameters: DeleteGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.integrationId === null || requestParameters.integrationId === undefined) {
            throw new runtime.RequiredError('integrationId','Required parameter requestParameters.integrationId was null or undefined when calling deleteGenerativeAiIntegration.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/{integration_id}`.replace(`{${"integration_id"}}`, encodeURIComponent(String(requestParameters.integrationId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete Generative AI integration
     * Delete Generative AI Integration
     */
    async deleteGenerativeAiIntegration(requestParameters: DeleteGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteGenerativeAiIntegrationRaw(requestParameters, initOverrides);
    }

    /**
     * Send Cloud Posture query to Generative AI Integration
     * Send Cloud Posture query to Generative AI Integration
     */
    async generativeAiIntegrationCloudPostureQueryRaw(requestParameters: GenerativeAiIntegrationCloudPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/query/cloud-posture`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelGenerativeAiIntegrationCloudPostureRequestToJSON(requestParameters.modelGenerativeAiIntegrationCloudPostureRequest),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Send Cloud Posture query to Generative AI Integration
     * Send Cloud Posture query to Generative AI Integration
     */
    async generativeAiIntegrationCloudPostureQuery(requestParameters: GenerativeAiIntegrationCloudPostureQueryRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.generativeAiIntegrationCloudPostureQueryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Send Kubernetes Posture query to Generative AI Integration
     * Send Kubernetes Posture query to Generative AI Integration
     */
    async generativeAiIntegrationKubernetesPostureQueryRaw(requestParameters: GenerativeAiIntegrationKubernetesPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/query/kubernetes-posture`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelGenerativeAiIntegrationKubernetesPostureRequestToJSON(requestParameters.modelGenerativeAiIntegrationKubernetesPostureRequest),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Send Kubernetes Posture query to Generative AI Integration
     * Send Kubernetes Posture query to Generative AI Integration
     */
    async generativeAiIntegrationKubernetesPostureQuery(requestParameters: GenerativeAiIntegrationKubernetesPostureQueryRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.generativeAiIntegrationKubernetesPostureQueryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Send Linux Posture query to Generative AI Integration
     * Send Linux Posture query to Generative AI Integration
     */
    async generativeAiIntegrationLinuxPostureQueryRaw(requestParameters: GenerativeAiIntegrationLinuxPostureQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/query/linux-posture`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelGenerativeAiIntegrationLinuxPostureRequestToJSON(requestParameters.modelGenerativeAiIntegrationLinuxPostureRequest),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Send Linux Posture query to Generative AI Integration
     * Send Linux Posture query to Generative AI Integration
     */
    async generativeAiIntegrationLinuxPostureQuery(requestParameters: GenerativeAiIntegrationLinuxPostureQueryRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.generativeAiIntegrationLinuxPostureQueryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Send Malware query to Generative AI Integration
     * Send Malware query to Generative AI Integration
     */
    async generativeAiIntegrationMalwareQueryRaw(requestParameters: GenerativeAiIntegrationMalwareQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/query/malware`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelGenerativeAiIntegrationMalwareRequestToJSON(requestParameters.modelGenerativeAiIntegrationMalwareRequest),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Send Malware query to Generative AI Integration
     * Send Malware query to Generative AI Integration
     */
    async generativeAiIntegrationMalwareQuery(requestParameters: GenerativeAiIntegrationMalwareQueryRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.generativeAiIntegrationMalwareQueryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Send Secret query to Generative AI Integration
     * Send Secret query to Generative AI Integration
     */
    async generativeAiIntegrationSecretQueryRaw(requestParameters: GenerativeAiIntegrationSecretQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/query/secret`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelGenerativeAiIntegrationSecretRequestToJSON(requestParameters.modelGenerativeAiIntegrationSecretRequest),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Send Secret query to Generative AI Integration
     * Send Secret query to Generative AI Integration
     */
    async generativeAiIntegrationSecretQuery(requestParameters: GenerativeAiIntegrationSecretQueryRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.generativeAiIntegrationSecretQueryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Send Vulnerability query to Generative AI Integration
     * Send Vulnerability query to Generative AI Integration
     */
    async generativeAiIntegrationVulnerabilityQueryRaw(requestParameters: GenerativeAiIntegrationVulnerabilityQueryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/query/vulnerability`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModelGenerativeAiIntegrationVulnerabilityRequestToJSON(requestParameters.modelGenerativeAiIntegrationVulnerabilityRequest),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Send Vulnerability query to Generative AI Integration
     * Send Vulnerability query to Generative AI Integration
     */
    async generativeAiIntegrationVulnerabilityQuery(requestParameters: GenerativeAiIntegrationVulnerabilityQueryRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.generativeAiIntegrationVulnerabilityQueryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List all the added Generative AI Integrations
     * List Generative AI Integrations
     */
    async listGenerativeAiIntegrationRaw(requestParameters: ListGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ModelGenerativeAiIntegrationListResponse>>> {
        const queryParameters: any = {};

        if (requestParameters.integrationType !== undefined) {
            queryParameters['integration_type'] = requestParameters.integrationType;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ModelGenerativeAiIntegrationListResponseFromJSON));
    }

    /**
     * List all the added Generative AI Integrations
     * List Generative AI Integrations
     */
    async listGenerativeAiIntegration(requestParameters: ListGenerativeAiIntegrationRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ModelGenerativeAiIntegrationListResponse>> {
        const response = await this.listGenerativeAiIntegrationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Set Default Generative AI integration
     * Set Default Generative AI Integration
     */
    async setDefaultGenerativeAiIntegrationRaw(requestParameters: SetDefaultGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.integrationId === null || requestParameters.integrationId === undefined) {
            throw new runtime.RequiredError('integrationId','Required parameter requestParameters.integrationId was null or undefined when calling setDefaultGenerativeAiIntegration.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/generative-ai-integration/{integration_id}/default`.replace(`{${"integration_id"}}`, encodeURIComponent(String(requestParameters.integrationId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set Default Generative AI integration
     * Set Default Generative AI Integration
     */
    async setDefaultGenerativeAiIntegration(requestParameters: SetDefaultGenerativeAiIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.setDefaultGenerativeAiIntegrationRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const ListGenerativeAiIntegrationIntegrationTypeEnum = {
    Openai: 'openai',
    AmazonBedrock: 'amazon-bedrock'
} as const;
export type ListGenerativeAiIntegrationIntegrationTypeEnum = typeof ListGenerativeAiIntegrationIntegrationTypeEnum[keyof typeof ListGenerativeAiIntegrationIntegrationTypeEnum];

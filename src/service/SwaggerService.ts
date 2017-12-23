import { BaseService } from '../base';
import { di, GET } from '../decorator';
import { RouteService } from './RouteService';

export interface SwaggerInfoContact {
  email: string;
}

export interface SwaggerInfo {
  description?: string;
  version?: string;
  title?: string;
  termsOfService?: string;
  contact?: SwaggerInfoContact;
}

export interface SwaggerTag {
  name: string;
  description: string;
  externalDocs?: {
    description: string;
    url: string;
  };
}

export type DataTypes = 'application/json' | 'application/xml';
export type ParamType = 'body' | 'path' | 'query' | 'header' | 'cockie';

export interface Param {
  in: ParamType;
  name: string;
  description?: string;
  required?: boolean;
  schema: any;
}

export interface SwaggerPathDescription {
  tags?: string[];
  summary?: string;
  description?: string;
  consumes?: DataTypes[];
  produces?: DataTypes[];
  parameters?: Param[];
  responses?: {
    [key: number]: {
      description?: string
      content?: any
    }
  };
}

export interface SwaggerPaths {
  [url: string]: {
    get?: SwaggerPathDescription;
    post?: SwaggerPathDescription;
    put?: SwaggerPathDescription;
    patch?: SwaggerPathDescription;
    delete?: SwaggerPathDescription;
    options?: SwaggerPathDescription;
  };
}

export type schemes = 'http' | 'https';

export interface Swagger {
  swagger?: string;
  info?: SwaggerInfo;
  host: string;
  basePath?: string;
  tags?: SwaggerTag[];
  schemes?: schemes[];
  paths?: SwaggerPaths;
  definitions?: {
    [name: string]: any
  };
}

interface SwaggerConfig {
  swagger: Swagger;
}

@di('RouteService')
export class SwaggerService extends BaseService {
  public static defaultConfig = {
    swagger: {
      host: 'localhost',
      swagger: '2.0',
      basePath: '',
      info: {},
      tags: [],
      schemes: ['http', 'https'],
      paths: {},
      definitions: {}
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization'
    },
    url: '/api/swagger/doc'
  };

  private routeService: RouteService;

  public init() {
    this.routeService.add(this.config.url, 'GET', this.actionDocument);
    super.init();
  }

  public actionDocument = () => {
    return {
      headers: this.config.headers,
      body: JSON.stringify(this.config.swagger)
    };
  }

  public addPath(url: string, method: string, params: SwaggerPathDescription) {
    if (!this.config.swagger.paths[url]) {
      this.config.swagger.paths[url] = {};
    }

    method = method.toLowerCase();

    this.config.swagger.paths[url][method] = params;
  }

  public addDefinitions(name: string, definition) {
    this.config.swagger.definitions[name] = definition;
  }

  public addTag(name: string, description?: string, externalDocs?: SwaggerTag) {
    const tag: any = {name};

    if (description) {
      tag.description = description;
    }

    if (externalDocs) {
      tag.externalDocs = externalDocs;
    }
    this.config.swagger.tags.push(tag);
  }
}

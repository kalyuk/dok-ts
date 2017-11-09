# dok-ts MVC NodeJS framework
by default in pack you have only routes and render services,
if you want database service or store or swagger service you make 
install and include from config

### How it use

##### to be used, you need install

````
yarn add dok-ts 
 
or 
 
npm i --save dok-ts
````

## Web Application

To be create Web application you need create file 
and extend from 'dok-ts/web/WebApplication'

when your maker create instance application
and passed config into constructor

````javascript
const configPath = path.join(__dirname, '..', 'config', 'main.ts');

const app = new WebApplication(configPath);
app.listen();
````

when run listen server

### WebController 
default root for controllers is "controllers" directory 
in module or application, but it make be changed from config 
````
controller: {
    dirName: controllers;
    ext: .js|.ts;
};
````

to be create controller you need create file camelCase name 
example "IndexController", postfix Controller will be required 
and extend from 'dok-ts/web/WebController'

action name will be `${yourName}Action`
example: "indexAction"  

action will be return result renderPUG | renderFile | renderJSON 

for more example yor make see: https://github.com/kalyuk/dok-ts-example

## Console Application
To be create Console application you need create file 
and extend from 'dok-ts/console/ConsoleApplication'

when your maker create instance application
and passed config into constructor

````javascript
const configPath = path.join(__dirname, '..', 'config', 'main.ts');

const app = new ConsoleApplication(configPath);
app.run()
````

## Configuration
````
{ 
    default : config, 
    .... environment: config
}
````

application environment passed from argument --env=environment,
by default env=development

#### env configuration 
````javascript
const config = {
  basePath: path.join(__dirname, '..'),
  id: 'example',
  modules: {
      ModulesName: {
          path: 'path to module',
          options: {
           // config for you module   
          }
      }
  },
  services: {
    RouteService: {
      options: {
        routes: {
          'GET /': {
            actionName: 'index',
            controllerName: 'index'
          },
          'GET /json': {
            actionName: 'json',
            controllerName: 'index'
          }
        }
      }
    },
    HttpService: {
      options: {
        port: 8080
      }
    },
    ServiceName: {
              path: 'path to service',
              options: {
               // config for you service   
              }
          }
  }
}
````


### Routing

rote format
```` 
`REQUEST_METHOD /string/<controllerName:regexp>/string` : {}
 
 POST /api/user/1
 POST /api/message/1
'POST /api/<controllerName:user|message>/<userId:\\d+>': {
    actionName: 'update'
}
 
'GET /json': {
    params: // optional, object
    moduleName: 'example' // optional,  if external module
    actionName: 'json',
    controllerName: 'index'
}
````
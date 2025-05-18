interface VirtualService {
  spec: {
    http: Array<{
      route: Array<{
        destination: {
          host: string;
          subset: string;
        };
        weight: number;
      }>;
    }>;
  };
}

interface DestinationRule {
  spec: {
    host: string;
    subsets: Array<{
      name: string;
      labels: {
        version: string;
      };
    }>;
  };
}

interface MockData {
  [key: string]: VirtualService;
}

interface MockDestinationRules {
  [key: string]: DestinationRule;
}

export class KubernetesService {
  // Mock data for development
  private mockServices = [
    {
      metadata: {
        name: 'service-a',
        namespace: 'default'
      },
      spec: {
        ports: [
          {
            port: 80,
            protocol: 'TCP',
            targetPort: 8080
          }
        ]
      }
    },
    {
      metadata: {
        name: 'service-b',
        namespace: 'default'
      },
      spec: {
        ports: [
          {
            port: 8080,
            protocol: 'TCP',
            targetPort: 8080
          }
        ]
      }
    }
  ];

  private mockVirtualServices: MockData = {
    'default/service-a': {
      spec: {
        http: [
          {
            route: [
              {
                destination: {
                  host: 'service-a',
                  subset: 'v1'
                },
                weight: 90
              },
              {
                destination: {
                  host: 'service-a',
                  subset: 'v2'
                },
                weight: 10
              }
            ]
          }
        ]
      }
    },
    'default/service-b': {
      spec: {
        http: [
          {
            route: [
              {
                destination: {
                  host: 'service-b',
                  subset: 'v1'
                },
                weight: 100
              }
            ]
          }
        ]
      }
    }
  };

  private mockDestinationRules: MockDestinationRules = {
    'default/service-a': {
      spec: {
        host: 'service-a',
        subsets: [
          {
            name: 'v1',
            labels: {
              version: 'v1'
            }
          },
          {
            name: 'v2',
            labels: {
              version: 'v2'
            }
          }
        ]
      }
    },
    'default/service-b': {
      spec: {
        host: 'service-b',
        subsets: [
          {
            name: 'v1',
            labels: {
              version: 'v1'
            }
          }
        ]
      }
    }
  };

  constructor() {
    // No need for Kubernetes client initialization in mock mode
  }

  async listServices() {
    return this.mockServices;
  }

  async getServiceDetails(namespace: string, name: string) {
    const key = `${namespace}/${name}`;
    return {
      virtualService: this.mockVirtualServices[key],
      destinationRule: this.mockDestinationRules[key]
    };
  }

  async updateTrafficWeights(namespace: string, name: string, weights: Record<string, number>) {
    const key = `${namespace}/${name}`;
    const virtualService = this.mockVirtualServices[key];
    
    if (!virtualService) {
      throw new Error('VirtualService not found');
    }

    const routes = virtualService.spec.http[0].route;
    routes.forEach((route: any) => {
      const version = route.destination.subset;
      if (weights[version] !== undefined) {
        route.weight = weights[version];
      }
    });

    // In a real implementation, this would update the Kubernetes resources
    console.log(`Mock: Updated traffic weights for ${key}:`, weights);
    return virtualService;
  }
} 
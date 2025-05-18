declare module '@kubernetes/client-node' {
  export class KubeConfig {
    loadFromDefault(): void;
    makeApiClient<T>(api: new (server: string) => T): T;
  }

  export class CustomObjectsApi {
    getNamespacedCustomObject(
      group: string,
      version: string,
      namespace: string,
      plural: string,
      name: string
    ): Promise<any>;

    replaceNamespacedCustomObject(
      group: string,
      version: string,
      namespace: string,
      plural: string,
      name: string,
      body: any
    ): Promise<any>;
  }

  export class CoreV1Api {
    listServiceForAllNamespaces(): Promise<{
      body: {
        items: any[];
      };
    }>;
  }
} 
// AppInsights.js
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';

const clickPluginInstance = new ClickAnalyticsPlugin();
// Click Analytics configuration
const clickPluginConfig = {
  autoCapture: true,
  dataTags: {
    useDefaultContentNameOrId: true
  },
};

const browserHistory = createBrowserHistory({ basename: '' });
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
    config: {
        connectionString: 'InstrumentationKey=a983f28b-b10e-4a57-a113-d5edfede053e;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/',
        extensions: [reactPlugin, clickPluginInstance],
        enableAutoRouteTracking: true,
        disableFetchTracking: false,
        extensionConfig: {
          [reactPlugin.identifier]: { history: browserHistory },
          [clickPluginInstance.identifier]: clickPluginConfig
        }
    }
});


appInsights.loadAppInsights();

var telemetryInitializer = (envelope) => {
  envelope.tags["ai.cloud.role"] = "FrontEnd";
  envelope.tags["ai.cloud.roleInstance"] = "FrontEnd_StoreApp_V1";
}
appInsights.addTelemetryInitializer(telemetryInitializer);

export { reactPlugin, appInsights };
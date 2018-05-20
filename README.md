# RAMP - Risk and Maintenance Prediction tool

## Content

### Smartthings App
Smartthings App is a smart automation app. When water leak sensor detect water it turn off the main water valve, notify property owner and send a maintenance order to local plumber.

### ELK Stack
We use ELK (Elastic Search, Logstash and Kibana) stack to collect and analyze IoT data.

### IoT Data generator
This script generate IoT test data

### AWS Lambda API Gateway Function
Smartthings App communicate with this function to notify IoT sensors state change. (Example: When water sensor detect water it call this api to trigger notification workflow). This function use Twilio to send sms to different stakeholder.

## Technologies Used
- Smartthings Smart App
- AWS Lambda API Gateway
- Twilio 
- Node.JS
- TypeScript
- JavaScript
- Groovy

## API End Point
POST https://n68a9oldhk.execute-api.us-east-1.amazonaws.com/dev/watersensor

import * as Twilio from "twilio";
import { Callback, Context, Handler } from "aws-lambda";

const twilioNumber = process.env.TWILIO_NUMBER;
const propertyManagerNumber = process.env.PROPERTY_MANAGER_NUMBER;
const plumberNumber = process.env.PLUMBER_NUMBER;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = new Twilio(accountSid, authToken);

const getMessageForPropertyManager = () => `ALERT! Your water leak sensor in Building 1, Apt #67 detect water leak under the sink, it turn off the water valve and notify the plumber :-)`;
const getMessageForPlumber = () => `URGENT NOTIFICATION! Property 101, Building 1, Apt #67 have a water leak and need your immediate inspection and repair. Please goto webportal, accept the job. Thank you for your service.`;

export const notificationHandler: Handler = async (event: any, context: Context, callback: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: event.body
    })
  };

  console.log("Message", event.body);
  const message = `You have a new job for water damage repair in. If you like to accept reply yes or reply no.`;
  
  // send text message to property manager
  await sendText(propertyManagerNumber, getMessageForPropertyManager());
  // send text message to plumber
  await sendText(plumberNumber, getMessageForPlumber());

  // create a plumbing work order
  await createAJob({
    title: "Work order for plumbing job",
    address: "Property address",
    type: "water damage",
    status: "pending",
    notes: [],
    createAt: new Date(),
    repairCompletedDate: new Date(),
    materialUsed: "joiners",
    expectedNextRepair: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  });

  await pushDataToMqtt({
    sensorId: "B1A67",
    status: "wet",
    createAt: new Date()
  });

  callback(null, response);
};

async function sendText(phoneNumber?: string, text?: string) {
  if (!validE164(phoneNumber)) {
    throw new Error("Number mush be E164 format!");
  }

  const testContent = {
    body: text,
    to: phoneNumber,
    from: twilioNumber
  };

  const message = client.messages.create(testContent);
  console.log("To: ", message.to);
}

function validE164(number?: string) {
  if (number) {
    return /^\+?[1-9]\d{1,14}$/.test(number);
  }
}

async function createAJob(job: any) {
  // Create a job when water leak sensor detect water
}

async function pushDataToMqtt(data: any) {
  // push data to mqtt
}

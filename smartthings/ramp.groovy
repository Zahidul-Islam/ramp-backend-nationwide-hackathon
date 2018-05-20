/**
 *  Ramp
 *
 *  Copyright 2018 Zahidul Islam
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */
definition(
    name: "RAMP",
    namespace: "zahidul-islam",
    author: "Zahidul Islam",
    description: "Help SMB to identify water damage",
    category: "My Apps",
    iconUrl: "https://s3.amazonaws.com/smartapp-icons/Convenience/Cat-Convenience.png",
    iconX2Url: "https://s3.amazonaws.com/smartapp-icons/Convenience/Cat-Convenience@2x.png",
    iconX3Url: "https://s3.amazonaws.com/smartapp-icons/Convenience/Cat-Convenience@2x.png")


preferences {
	section("When water is sensed...") {
		input "sensor", "capability.waterSensor", title: "Where?", required: true, multiple: true
	}
	section("Close the valve...") {
		input "valve", "capability.valve", title: "Which?", required: true, multiple: false
	}
    section("When water leak detected activate the Camera") {
    	input "camera", "capability.switch", title: "Where?", require: true, multiple: false
    }
	section("Send this message (optional, sends standard status message if not specified)"){
		input "messageText", "text", title: "Message Text", required: false
	}
	section("Via a push notification and/or an SMS message"){
		input "phone", "phone", title: "Phone Number (for SMS, optional)", required: false
		input "pushAndPhone", "enum", title: "Both Push and SMS?", required: false, options: ["Yes","No"]
	}
	section("Minimum time between messages (optional)") {
		input "frequency", "decimal", title: "Minutes", required: false
	}
}

def installed() {
 	subscribe(sensor, "water", waterHandler)
    valve?.open()
}

def updated() {
	unsubscribe()
 	subscribe(sensor, "water", waterHandler)
}

def waterHandler(evt) {
	log.debug "Sensor says ${evt.value}"
	if (evt.value == "wet") {
		valve.close()
	}
	if (frequency) {
		def lastTime = state[evt.deviceId]
		if (lastTime == null || now() - lastTime >= frequency * 60000) {
			sendMessage(evt)
		}
	}
	else {
		sendMessage(evt)
	}    
}

private sendMessage(evt) {
	def msg = messageText ?: "We closed the valve because moisture was detected"
	log.debug "$evt.name:$evt.value, pushAndPhone:$pushAndPhone, '$msg'"

	if (!phone || pushAndPhone != "No") {
		log.debug "sending push"
		sendPush(msg)
        executeLambdaFunctionAndSendSms()
	}
	if (frequency) {
		state[evt.deviceId] = now()
	}
}


def executeLambdaFunctionAndSendSms() {
	def params = [
        uri: "https://n68a9oldhk.execute-api.us-east-1.amazonaws.com/dev/watersensor",
        body: [
            wet: "true"
        ]
    ]

    try {
        httpPostJson(params) { resp ->
            resp.headers.each {
                log.debug "${it.name} : ${it.value}"
            }
            log.debug "response contentType: ${resp.    contentType}"
        }
    } catch (e) {
        log.debug "something went wrong: $e"
    }
}
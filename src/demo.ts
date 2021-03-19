/*
Demo of Oxhr, an object-oriented XHR (XMLHttpRequest) wrapper/library.
https://github.com/Amarok24/Oxhr
*/

import { Oxhr } from "./oxhr.ts";
import type { IXhrParams, IRequestHeader } from "./ixhrparams.ts";

const startButton = document.querySelector<HTMLButtonElement>("#startButton");
const abortButton = document.querySelector<HTMLButtonElement>("#abortButton");
const loadProgress = document.querySelector<HTMLProgressElement>("#loadProgress");
const loadBytes = document.querySelector<HTMLElement>("#loadBytes");



// -=-=-= A VERY BASIC USAGE EXAMPLE =-=-=-
// See console for output. You can then call FetchRandomStarWarsData() as many times as you want to fetch another random StarWars data.

async function FetchRandomStarWarsData()
{
	const random: number = Math.floor(Math.random() * 10 + 1);

	const mySimpleOptions: IXhrParams = {
		url: `https://swapi.dev/api/people/${random}`,
		// I also recommend this free API for testing: https://webhook.site/
		consoleInfo: "Establishing my simple test connection...",
		LoadEnd: () =>
		{
			alert("See console output for StarWars data!");
		}
	};

	// The shortest possible call if you don't care about the return type.
	const mySimpleConnection = new Oxhr(mySimpleOptions);

	const result: any = await mySimpleConnection.Send();

	console.log(result);
}



// -=-=-= A MORE ADVANCED USAGE EXAMPLE =-=-=-
// You may set network throttling to slow 3G or fast 3G to try out the Abort button.

const myRequestHeaders: IRequestHeader[] = [
	/*
		{
			header: "Accept",
			value: "application/json" // Necessary for some servers.
		},
		{
			header: "Content-Type",
			value: "application/json" // Necessary for some servers.
		},
	*/
];

const myOptions: IXhrParams = {
	// Attention, daily.json is quite large, 29 Mb
	url: "https://api.covidtracking.com/v1/states/daily.json",
	// url: "https://webhook.site/4542eb6f-60f6-4643-b6df-af56e24bed1e",
	method: "get",
	responseType: "json",
	data: `{ "test": 123 }`,
	requestHeaders: myRequestHeaders,
	timeoutMs: 7000,
	consoleInfo: "Establishing my test connection...",
	LoadEnd: OnLoadEnd,
	TimeOut: OnTimeOut,
	Progress: OnProgress,
	Abort: OnAbort
};

interface IJsonResponse
{
	someFixedResponseData: number;
}

const myConnection: Oxhr<IJsonResponse> = new Oxhr<IJsonResponse>(myOptions);
// Or shorter with type inference:
//const myConnection = new Oxhr<IJsonResponse>(xhrOptions);


async function TryToSendData(): Promise<void>
{
	let response: IJsonResponse;

	try
	{
		response = await myConnection.Send();

		if (response && response.someFixedResponseData === 123)
		{
			// You won't get this response, of course, that's just an example.
			console.log("We got someFixedResponseData 123");
		}
		else
		{
			console.log("HTML response OK, but someFixedResponseData not received.");
		}

		// Attention, daily.json is quite large, 29 Mb
		// console.log(response);
	}
	catch (err)
	{
		// 'err' is error message from "reject( new Error() )" lines in oxhr.ts
		console.log(`An error occured, but we handled it. Error message: ${err.message}`);
	}
}


function OnProgress(percent: number, bytes: number): void
{
	// Very often the total filesize is not known, in such a case percent will be -1
	if (loadProgress) loadProgress.value = percent;
	if (loadBytes) loadBytes.innerText = bytes + " bytes";
}


function OnAbort(): void
{
	console.log("OnAbort called!");
}


function OnLoadEnd(): void
{
	console.log("OnLoadEnd called!");
}


function OnTimeOut(): void
{
	console.log("OnTimeOut called!");
}

function OnStartButtonClick()
{
	console.log("start OnStartButtonClick");
	TryToSendData();
	console.log("end OnStartButtonClick");
}

function OnAbortButtonClick()
{
	console.log("start OnAbortButtonClick");
	myConnection.Abort();
	console.log("end OnAbortButtonClick");
}


if (startButton) startButton.addEventListener("click", OnStartButtonClick);
if (abortButton) abortButton.addEventListener("click", OnAbortButtonClick);


FetchRandomStarWarsData(); // see console output
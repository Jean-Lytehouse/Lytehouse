import axios from 'axios';
import { authHeader } from '../base.service';

const baseUrl = "http://192.168.181.177:80";

export const cameraService = {
  submit,
  openInNewTab
};

function openInNewTab(ip_address, name) {
  var win = window.open(baseUrl + `/predict?ip_address=` + ip_address + "&name=" + name, '_blank');
  win.focus();
}

function submit(ip_address, name) {
  return axios.get(baseUrl + `/predict?ip_address=` + ip_address + "&name=" + name, { headers: { "Content-Type": "application/json" } })
    .then(resp => {
      console.log("In response");
      let response = null;
      if (resp) response = resp.data;
      console.log("response");
      return {
        response: response,
        status: resp.status,
        message: resp.statusText
      }
    })
    .catch(error => {
      if (error.response) {
        return {
          response: null,
          status: error.response.status,
          message: error.response.statusText
        };
      } else {
        // The request was made but no response was received
        return {
          response: null,
          status: null,
          message: error.message
        };
      }
    });
}


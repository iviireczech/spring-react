import config from '../config/config';
import axios from 'axios';

import { logoutUser } from './../actions/logout/logout';
import { loadingData, dataLoaded } from './../actions/data/pendingTasks';

export default class DataAccessService {

    constructor(dispatch) {
        this.instance = axios.create({
            baseURL: config.apiUrl,
            headers: {
                "Content-Type": "application/json"
            },
            transformRequest: (data) => JSON.stringify(data),
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });

        this.instance.interceptors.request.use((config) => {
            dispatch(loadingData());
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            dispatch(dataLoaded());
            return Promise.reject(error);
        });

        this.instance.interceptors.response.use((response) => {
            dispatch(dataLoaded());
            if (response.status == 401) {
                dispatch(logoutUser());
                return Promise.reject(response.data.data.message);
            }
            return response.data.data;
        }, (error) => {
            dispatch(dataLoaded());
            if (!error.message) {
                error.message = "Internal Server Error";
            }
            return Promise.reject(error.message);
        });

    }

    get(url, data) {
        return this.instance.get(url, data);
    }

    post(url, data) {
        return this.instance.post(url, data);
    }

    put(url, data) {
        return this.instance.put(url, data);
    }

    delete(url) {
        return this.instance.delete(url);
    }

}
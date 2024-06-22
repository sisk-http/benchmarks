import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
    vus: 500,
    duration: '60s',
};
export default function () {
    http.get('http://localhost:5000/');
}
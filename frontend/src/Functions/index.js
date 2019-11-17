const apiCall = (action, body, path, method) => fetch(path, {
    method: method,
    headers: {
        'Content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,

}).then(response => response.json().then(data => ({
        data: data,
        status: response.status,
        ok: response.ok
    }))
).then(res => ({
        type: action + (res.ok ? '_RESULT' : '_ERROR'),
        payload: res.ok ? res.data : {status: res.status, response: res.data},
    })
).catch(error => {
    console.error("API error", error);
    return {
        type: action + '_ERROR',
        error: true,
        payload: error,
    }
});

export const Get = (action, path) => apiCall(action, null, path, 'GET');
export const Post = (action, body, path) => apiCall(action, body, path, 'POST');
export const Put = (action, body, path) => apiCall(action, body, path, 'PUT');
export const Delete = (action, path) => apiCall(action, path, 'DELETE');
export const Patch = (action, body, path) => apiCall(action, body, path, 'PATCH');
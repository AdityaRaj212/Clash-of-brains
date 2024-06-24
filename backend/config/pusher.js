import Pusher from 'pusher';

const pusher = new Pusher({
    appId: "1823759",
    key: "9ab1a8af120cfd1dbc4f",
    secret: "57583af6cc543ee50489",
    cluster: "ap2",
    useTLS: true
});

export default pusher;
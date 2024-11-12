import { KernelManager, ServerConnection } from "@jupyterlab/services";

// Launch Jupyter server with:
// jupyter server --ServerApp.token="" --ServerApp.disable_check_xsrf=True

const serverSettings = ServerConnection.makeSettings({
    baseUrl: "http://127.0.0.1:8888",
    token: "",
});
const kernelManager = new KernelManager({ serverSettings });

console.log('Kernel starting');
const kernel = await kernelManager.startNew({ name: "julia-1.11" });

kernel.statusChanged.connect((_, status) => {
    console.log(`Status: ${status}`);
});

console.log('Executing code');

const future = kernel.requestExecute({
    code: 'println("Hello world"); x = 1',
    user_expressions: {
        "y": "2x",
    }
});

// Handle iopub messages
future.onIOPub = msg => {
    if (msg.header.msg_type !== 'status') {
        console.log(msg.content);
    }
};
const reply = await future.done;

console.assert(reply.content.status === "ok");
console.log(`Reply: ${JSON.stringify(reply.content, null, 2)}`);

console.log('Execution is done');

console.log('Kernel shutting down');
kernel.shutdown();

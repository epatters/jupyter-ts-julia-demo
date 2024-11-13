import { KernelManager, ServerConnection } from "@jupyterlab/services";

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
    code: 'include("setup_kernel.jl"); x = 2; JsonValue([x, 2x, 3x])',
    // XXX: IJulia seems to not return JSON data for user expressions.
    // user_expressions: {
    //     "array": "JsonValue([x, 2x, 3x])",
    // },
});

// Handle iopub messages
future.onIOPub = msg => {
    if (msg.header.msg_type !== 'status') {
        console.log(msg.content);
    }
};

// Handle reply
const reply = await future.done;
console.assert(reply.content.status === "ok");
console.dir(reply.content, {depth: null});

console.log('Execution is done');

console.log('Kernel shutting down');
kernel.shutdown();

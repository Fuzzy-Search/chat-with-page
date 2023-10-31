## Here is the dev server for streaming

It uses vercel in order create an edge function. It is not optimal, this is the first initial variation of the server! Core feature why I kept it is **streaming** opportunity

To run the development server:

```bash
# step 1 install
pnpm i
# step 2 run
pnpm dev
```

The endpoint is located at  [http://localhost:3000/api/chat](http://localhost:3000/api/chat)
You can try to ping this endpoint

To send a POST request to this endpoint with a JSON body, you can use the following curl command:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "messages": [
    {
      "role": "assistant",
      "content": "Hello, how can I assist you today?"
    },
    {
      "role": "user",
      "content": "Explain to me AI."
    }
  ],
  "context": "Programming assistant"
}' http://localhost:3000/api/chat
```


You can start editing the API by modifying "local-stream/src/app/api/chat/route.ts"


## Loom demo of running!

[loom link](#TOOD)
const config = {
  env : {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT! ,
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT! ,
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY! ,
      privateKey: process.env.IMAGE_KIT_PRIVATE_KEY! ,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT!,
    },
    databaseUrl : process.env.DATABASE_URL!,
    upstash : {
      redisUrl: process.env.UPSTASH_REDIS_URL!,
      redisToken: process.env.UPSTASH_REDIS_TOKEN!,
        qstashUrl: process.env.QSTASH_URL!,
       qstashToken: process.env.QSTASH_TOKEN!,
       qstashCurrentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
       qstashNextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
    },
   
       resendToken : process.env.RESEND_TOKEN!,
        emailjs: {
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID, 
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    }
    
  },
}

export default config;
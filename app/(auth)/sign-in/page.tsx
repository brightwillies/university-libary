 "use client";
 import React from 'react'
import Authform from '@/components/Authform'
import {signInSchema} from "@/lib/validations";
import { signInWithCredentials } from '@/lib/actions/auth';

const page = () => 
     (
        <Authform type="SIGN_IN"
            schema= {signInSchema}        
            defaultValues={{
                email: "",
                password: "",
            }}

            onSubmit = {signInWithCredentials}

            />
  );


export default page
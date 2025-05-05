'use client';
import {signInSchema} from "@/lib/validations";
import { signInWithCredentials } from '@/lib/actions/auth';
import Authform from "@/components/Authform";
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
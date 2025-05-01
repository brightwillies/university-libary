"use client";
import Authform from '@/components/Authform'
import { signUpSchema } from "@/lib/validations";
import { signUp } from '@/lib/actions/auth';

const page = () => 
     (
        <Authform type="SIGN_UP"
            schema={signUpSchema}
            defaultValues={{
                email: "",
                password: "",
                fullName: "",
                universityId: 0,
                universityCard: ""
            }}

             onSubmit={signUp}

        />
    );

export default page
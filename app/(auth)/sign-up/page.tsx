'use client';
import { signUpSchema } from "@/lib/validations";
import { signUp } from '@/lib/actions/auth';
import Authform from "@/components/Authform";

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
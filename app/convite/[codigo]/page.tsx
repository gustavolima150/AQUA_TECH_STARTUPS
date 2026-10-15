import { InvitePage } from "@/components/invite-page";
export default async function Invite({params}:{params:Promise<{codigo:string}>}){const {codigo}=await params;return <InvitePage codigo={codigo}/>}

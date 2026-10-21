import { Sprout } from "lucide-react";
export default function WorkspaceLoading() {
  return <div className="v-loading-screen" role="status" aria-live="polite"><div className="v-loading-symbol"><Sprout size={24}/></div><span>Preparando seu espaço de trabalho...</span><div className="v-loading-track"><span/></div></div>;
}

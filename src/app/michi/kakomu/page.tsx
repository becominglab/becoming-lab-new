import { redirect } from "next/navigation";

/** 食事会（その道を、囲む）は休止中。/michi へ案内します */
export default function KakomuPage() {
  redirect("/michi");
}

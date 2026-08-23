import axios from "axios";

export function triggerFrontendDeploy(reason = "") {
    const hookUrl = process.env.RENDER_DEPLOY_HOOK_URL;
    if (!hookUrl) return;
    axios.post(hookUrl)
        .then(() => console.log("Frontend rebuild triggered:", reason))
        .catch((error) => console.error("Deploy hook failed (publish unaffected):", error.message));
}

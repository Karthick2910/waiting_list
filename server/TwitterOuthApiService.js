const { Utils } = require('./Utils');

const HOST_URL = "https://api.twitter.com/2";

class TwitterOuthApiService {
  static mHost;

  static Init(host) {
    this.mHost = host;
  }

  static GetHost() {
    return this.mHost || HOST_URL;
  }

  static GetHeaders(accessToken) {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      const encodedCredentials = Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString("base64");
      headers["Authorization"] = `Basic ${encodedCredentials}`;
    }

    return headers;
  }

  static async getUser(accessToken) {
    try {
    const url = `${this.GetHost()}/users/me`;
      const response = await Utils.PerformGetRequest(url, undefined, this.GetHeaders(accessToken));
      return { result: response.data, error: undefined };
    } catch (error) {
      console.error("Error in getUser:", error);
      return { result: undefined, error };
    }
  }

  static async getToken(code, codeVerifier, redirectUri) {
    try {
      const url = `${this.GetHost()}/oauth2/token`;
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        client_id: process.env.CLIENT_ID,
      }).toString();

      const response = await Utils.PerformPostRequest(url, body, this.GetHeaders());
      return { result: response, error: undefined };
    } catch (error) {
      console.error("Error in getToken:", error);
      return { result: undefined, error };
    }
  }

  static async refreshToken(refreshToken) {
    try {
      const url = `https://api.x.com/2/oauth2/token`;
      const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: process.env.CLIENT_ID,
      }).toString();

      const response = await Utils.PerformPostRequest(url, body, this.GetHeaders());
      return { result: response, error: undefined };
    } catch (error) {
      console.error("Error in refreshToken:", error);
      return { result: undefined, error };
    }
  }

  static async revokeToken(accessToken) {
    try {
      const url = `https://api.x.com/2/oauth2/revoke`;
      const body = new URLSearchParams({
        token: accessToken,
        token_type_hint: "access_token",
      }).toString();

      const response = await Utils.PerformPostRequest(url, body, this.GetHeaders());
      return { result: response, error: undefined };
    } catch (error) {
      console.error("Error in revokeToken:", error);
      return { result: undefined, error };
    }
  }

  static async followUser(fromUserId, toUserId, accessToken) {
    try {
      const url = `${this.GetHost()}/users/${fromUserId}/following`;
      const response = await Utils.PerformPostRequest(
        url,
        JSON.stringify({ target_user_id: toUserId }),
        {
          ...this.GetHeaders(accessToken),
          "Content-Type": "application/json",
        }
      );
      return { result: response, error: undefined };
    } catch (error) {
      console.error("Error in followUser:", error);
      return { result: undefined, error };
    }
  }
}

module.exports = { TwitterOuthApiService };

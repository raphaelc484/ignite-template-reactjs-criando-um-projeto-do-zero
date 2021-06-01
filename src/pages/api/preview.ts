/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Prismic from '@prismicio/client';

import { Document } from '@prismicio/client/types/documents';

export const apiEndpoint = process.env.PRISMIC_API_ENDPOINT;
export const acessToken = process.env.PRISMIC_ACESS_TOKEN;

function linkResolver(doc: Document): string {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

export const Client = (req = null) =>
  Prismic.client(apiEndpoint, createClientOptions(req, acessToken));

const createClientOptions = (req = null, prismicAcessToken = null) => {
  const reqOption = req ? { req } : {};

  const acessTokenOption = prismicAcessToken
    ? { acessToken: prismicAcessToken }
    : {};

  return {
    ...reqOption,
    ...acessTokenOption,
  };
};

const Preview = async (req, res) => {
  const { token: ref, documentId } = req.query;

  const redirectUrl = await Client(req)
    .getPreviewResolver(ref, documentId)
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });
  res.writeHead(302, { Location: `${redirectUrl}` });
  res.end();
};

export default Preview;

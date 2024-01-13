// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getEnvironmentVariables } from "../../utils/utils";


export default function handler(req, res) {
  console.log(getEnvironmentVariables())
  res.status(200).json({ name: 'John Doe' })
}

import responseBody from '../propertyTax/transaction/document/billBody.json'
export default function handler(req, res) {
  res.status(200).json(responseBody)
}

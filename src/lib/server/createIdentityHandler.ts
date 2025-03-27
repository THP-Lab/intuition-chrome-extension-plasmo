
import { ApiError, IdentitiesService } from '../../api/src/api-client'
import { MULTIVAULT_CONTRACT_ADDRESS } from '../config'

export const createIdentity = async ({
  wallet,
  display_name,
  identity_id,
  description,
}: {
  wallet: string
  display_name: string
  identity_id: string
  description?: string
}) => {
  console.log('🔐 Creating identity with:', {
    contract: MULTIVAULT_CONTRACT_ADDRESS,
    creator: wallet,
    display_name,
    identity_id,
    description,
    is_user: true,
  })

  try {
    const identity = await IdentitiesService.createIdentity({
      requestBody: {
        contract: MULTIVAULT_CONTRACT_ADDRESS,
        creator: wallet,
        display_name,
        identity_id,
        description,
        is_user: true,
      },
    })

    console.log('✅ Identity created:', identity)
    return identity
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        ` API Error - ${error.status}: ${error.message} - ${JSON.stringify(error.body)}`
      )
    } else {
      console.error(' Unknown error:', error)
    }
    throw error
  }
}

import {
  BusinessService,
  type BusinessSettingsInput,
} from "@/services/business/business.service"

export class SettingsService {
  static async getSettings(businessId: string) {
    return BusinessService.getSettings(businessId)
  }

  static async updateSettings(
    businessId: string,
    input: BusinessSettingsInput
  ) {
    return BusinessService.updateSettings(businessId, input)
  }
}

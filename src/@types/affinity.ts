import { Pubkey } from './base'


export interface AffinityRelay  {
    pubKey: Pubkey,
    url: string,
    name: string,
    latitudeRange: AffinityLatitudeRange,
    longitudeRange: AffinityLongitudeRange,
    description: string,
    pricing: AffinityPrice,
    contactDetail: AffinityContactDetail
}

export interface DBAffinityRelay {
    pubkey: Buffer,
    name: string,
    url: string,
    pricing: string,
    contactDetail: string,
    description: string,
    latitudeMin: number,
    latitudeMax: number,
    longitudeMin: number,
    longitudeMax: number,    
}

export interface AffinityMerchant {
    pubkey: Pubkey,
    name: string,
    latitude: number,
    longitude: number,
    description: string,
    pricing: AffinityPrice,
    contactDetail: AffinityContactDetail,
    isAdvertised: boolean,
    balance: number,
    advertisedOn: Date | undefined
}

export interface DBAffinityMerchant {
    pubkey: Buffer,
    name: string,
    description: string,
    pricing: string,
    contactDetail: JSON,
    latitude: number,
    longitude: number,
    balance: number,
    advertisedOn: Date | undefined,
    isAdvertised: boolean
}

export interface AffinityMerchantRequest {
    pubkey: Pubkey,
    name: string,
    description: string,
    pricing: AffinityPrice,
    contactDetail: AffinityContactDetail,
    latitude: number,
    longitude: number,   
}

export interface DBAffinityMerchantRequest {
    pubkey: Buffer,
    name: string,
    description: string,
    pricing: string,
    contactDetail: JSON,
    latitude: number,
    longitude: number
}

export interface AffinityRelayRequest {
    pubkey: Pubkey,
    senderPubkeys: Pubkey[],
    name: string,
    url: string,
    pricing: string,
    description: string,
    contactDetail: AffinityContactDetail,
    latitudeRange: AffinityLatitudeRange,
    longitudeRange: AffinityLongitudeRange,
}

export interface DBAffinityRelayRequest {
    pubkey: Buffer,
    senderPubkeys: JSON,
    name: string,
    url: string,
    pricing: string,
    description: string,
    contactDetail: JSON,
    latitudeMin: number,
    latitudeMax: number,
    longitudeMin: number,
    longitudeMax: number
}

export type AffinityPrice = string;

export type AffinityContactDetail = {
    phoneNumber: string
}

export type AffinityLatitudeRange = AffinityGeographicRange;

export type AffinityLongitudeRange = AffinityGeographicRange;


type AffinityGeographicRange = {
    min_range: number,
    max_range: number
};
export interface reportModel{
    donationDate:number,
    name:string,
    email:string,
    donationAmount:number,
    organisation:string,
    item:string
}

export const reportData:reportModel[] = [
    {
        donationDate: Date.now(),
        name:"Greg Smith",
        email:"greg@example.com",
        donationAmount:20,
        organisation:"Social Moments",
        item:"oven"
    },
    {
        donationDate: Date.now(),
        name:"Greg Smith",
        email:"greg@example.com",
        donationAmount:20,
        organisation:"Social Moments",
        item:"oven"
    },
    {
        donationDate: Date.now(),
        name:"Greg Smith",
        email:"greg@example.com",
        donationAmount:20,
        organisation:"Social Moments",
        item:"oven"
    },
    {
        donationDate: Date.now(),
        name:"Greg Smith",
        email:"greg@example.com",
        donationAmount:20,
        organisation:"Social Moments",
        item:"oven"
    },
]
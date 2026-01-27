
type voters = {
   id:string,
   candidateId: 1,
   voterName:string,
   votes:number[],
}

export type TReportCandidate = {
   id: number;
   candidateId: number;
   candidateName: string;
   firstName: string;
   lastName: string;
   picture: string;
   position: string;
}; 
export type reportsTypes = {
     total: number[]
     voters:voters[]
     sum:number
     candidates:TReportCandidate[]
}
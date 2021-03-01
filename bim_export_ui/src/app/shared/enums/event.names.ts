export const EventNames = {
    contractUpdated: "contractUpdated", //contract entity changes
    attachmentChanged: "attachmentChanged", //{ entity: EntityNames.SOW }, { entity: EntityNames.Contract }
    proposalUpdated: "proposalUpdated", //proposal update
    sowUpdated: "sowUpdated", //SOW text change
    jobOrderUpdated: "jobOrderUpdated", //event that changes the jobOrder package state to dirty
    hubSOWChanged: "hubSOWChanged", // hub event for SOW
    hubAttachmentChanged: "hubAttachmentChanged", //{ entity: EntityNames.SOW }, { entity: EntityNames.Contract }
    hubProposalUpdated: "hubProposalUpdated", //hub event for proposal update
    refreshPDFButton: "refreshPDFButton", //{ contextTypeId: 3 }, { contextTypeId: 7 }, { contextTypeId: 9 } 
    lineItemFavoriteChanged: "lineItemFavoriteChanged",
    nppItemChanged: "nppItemChanged",
    hubProposalPdfGenerated: "hubProposalPdfGenerated", // { groupId: jobOrderId, contextTypeId: contextTypes.PriceProposal, newReport: newReport }
    hubProposalSummaryPdfGenerated: "hubProposalSummaryPdfGenerated", // { groupId: jobOrderId, contextTypeId: contextTypes.PriceProposalSummary, newReport: newReport }
    hubProposalTotalChanged: "hubProposalTotalChanged", // { groupId: jobOrderId, editDelta: message} - JobOrder total changes when proposal changes
    hubJobOrderPackagePdfGenerated: "hubJobOrderPackagePdfGenerated", // { groupId: jobOrderId, contextTypeId: contextTypes.JobOrderPackage, newReport: newReport }
    pdfListUpdated: "pdfListUpdated", // { contextTypeId: contextTypeId }
    hubProposalDetailPdfGenerated: "hubProposalDetailPdfGenerated", // { groupId: jobOrderId, contextTypeId: contextTypes.PriceProposalDetail, newReport: newReport }
    proposalIdChanged: "proposalIdChanged", // {id: priceProposalId}
    //collaboration
    //proposalCollaborationReloadChanges: "proposalCollaborationReloadChanges", // {priceProposalStateId: priceProposalStateId}
    proposalCollaborationSubmit: "proposalCollaborationSubmit",
    hubProposalVersioned: "hubProposalVersioned",
    //
    tokenExpiring: "onTokenExpiring",
    tokenRenew: "onTokenRenew",
    userLoggedIn: "userLoggedIn",
    userLoggedOut: "userLoggedOut",
    userDetailsUpdated: "userDetailsUpdated",
    resetPriceProposalFactory: "resetPriceProposalFactory",
    estimateUpdated: "estimateUpdated", //proposal update
    //
    showNotification: 'showNotificationEvent',
    showConverter: 'showConverterEvent',
    showBigNote: 'showBigNoteEvent',
    showTechSpecs: 'showTechSpecsEvent',
    reloadApplication: 'reloadApplication',
    reportPackageStatusChanged:"reportPackageStatusChanged",
    refreshReportPackages:"refreshReportPackages",
    //
    refreshMilestones: "refreshMilestones",
    refreshTabsBackgroundColor: "refreshTabsBackgroundColor",
};

export interface IEventHandlerEstimateUpdated {
    estimateId: number;
}

export interface IEventHandlerPriceProposalUpdated {
    priceProposalId: number;
    hasLineItems: boolean;
    priceProposalTotal: number;
}
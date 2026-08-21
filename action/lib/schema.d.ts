import { z } from 'zod';
export declare const configuration: z.ZodObject<{
    githubPersonalAccessToken: z.ZodString;
    githubWorkflowToken: z.ZodString;
    issueLabels: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string[], string>, string[], string>;
    issueLimitCommenter: z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">;
    issueLockOnClose: z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">;
    issueMessageNotSponsor: z.ZodEffects<z.ZodString, string, string>;
    issueMessageWelcome: z.ZodEffects<z.ZodString, string, string>;
    isOrganization: z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">;
    sponsorActiveOnly: z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">;
    sponsorExemptFileLocation: z.ZodEffects<z.ZodString, string, string>;
    sponsorMinimum: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    githubPersonalAccessToken: string;
    githubWorkflowToken: string;
    issueLabels: string[];
    issueLimitCommenter: boolean;
    issueLockOnClose: boolean;
    issueMessageNotSponsor: string;
    issueMessageWelcome: string;
    isOrganization: boolean;
    sponsorActiveOnly: boolean;
    sponsorExemptFileLocation: string;
    sponsorMinimum: number;
}, {
    githubPersonalAccessToken: string;
    githubWorkflowToken: string;
    issueLabels: string;
    issueLimitCommenter: "true" | "false";
    issueLockOnClose: "true" | "false";
    issueMessageNotSponsor: string;
    issueMessageWelcome: string;
    isOrganization: "true" | "false";
    sponsorActiveOnly: "true" | "false";
    sponsorExemptFileLocation: string;
    sponsorMinimum: number;
}>;
export declare const issueCommentPayload: z.ZodObject<{
    action: z.ZodUnion<[z.ZodLiteral<"created">, z.ZodLiteral<"deleted">, z.ZodLiteral<"edited">]>;
    comment: z.ZodObject<{
        author_association: z.ZodUnion<[z.ZodLiteral<"COLLABORATOR">, z.ZodLiteral<"CONTRIBUTOR">, z.ZodLiteral<"FIRST_TIMER">, z.ZodLiteral<"FIRST_TIME_CONTRIBUTOR">, z.ZodLiteral<"MANNEQUIN">, z.ZodLiteral<"MEMBER">, z.ZodLiteral<"NONE">, z.ZodLiteral<"OWNER">]>;
        node_id: z.ZodString;
        user: z.ZodNullable<z.ZodObject<{
            login: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            login: string;
        }, {
            login: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        node_id: string;
        user: {
            login: string;
        } | null;
    }, {
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        node_id: string;
        user: {
            login: string;
        } | null;
    }>;
    issue: z.ZodObject<{
        labels: z.ZodArray<z.ZodObject<{
            color: z.ZodString;
            default: z.ZodBoolean;
            description: z.ZodNullable<z.ZodString>;
            id: z.ZodNumber;
            name: z.ZodString;
            node_id: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }, {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }>, "many">;
        user: z.ZodNullable<z.ZodObject<{
            login: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            login: string;
        }, {
            login: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        user: {
            login: string;
        } | null;
        labels: {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }[];
    }, {
        user: {
            login: string;
        } | null;
        labels: {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    action: "created" | "deleted" | "edited";
    comment: {
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        node_id: string;
        user: {
            login: string;
        } | null;
    };
    issue: {
        user: {
            login: string;
        } | null;
        labels: {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }[];
    };
}, {
    action: "created" | "deleted" | "edited";
    comment: {
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        node_id: string;
        user: {
            login: string;
        } | null;
    };
    issue: {
        user: {
            login: string;
        } | null;
        labels: {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }[];
    };
}>;
export declare const issuesPayload: z.ZodObject<{
    action: z.ZodUnion<[z.ZodLiteral<"assigned">, z.ZodLiteral<"closed">, z.ZodLiteral<"deleted">, z.ZodLiteral<"demilestoned">, z.ZodLiteral<"edited">, z.ZodLiteral<"labeled">, z.ZodLiteral<"locked">, z.ZodLiteral<"milestoned">, z.ZodLiteral<"opened">, z.ZodLiteral<"pinned">, z.ZodLiteral<"reopened">, z.ZodLiteral<"transferred">, z.ZodLiteral<"unassigned">, z.ZodLiteral<"unlabeled">, z.ZodLiteral<"unlocked">, z.ZodLiteral<"unpinned">]>;
    issue: z.ZodObject<{
        author_association: z.ZodUnion<[z.ZodLiteral<"COLLABORATOR">, z.ZodLiteral<"CONTRIBUTOR">, z.ZodLiteral<"FIRST_TIMER">, z.ZodLiteral<"FIRST_TIME_CONTRIBUTOR">, z.ZodLiteral<"MANNEQUIN">, z.ZodLiteral<"MEMBER">, z.ZodLiteral<"NONE">, z.ZodLiteral<"OWNER">]>;
        labels: z.ZodArray<z.ZodObject<{
            color: z.ZodString;
            default: z.ZodBoolean;
            description: z.ZodNullable<z.ZodString>;
            id: z.ZodNumber;
            name: z.ZodString;
            node_id: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }, {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }>, "many">;
        locked: z.ZodBoolean;
        node_id: z.ZodString;
        user: z.ZodNullable<z.ZodObject<{
            login: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            login: string;
        }, {
            login: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        node_id: string;
        user: {
            login: string;
        } | null;
        labels: {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }[];
        locked: boolean;
    }, {
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        node_id: string;
        user: {
            login: string;
        } | null;
        labels: {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }[];
        locked: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    action: "deleted" | "edited" | "assigned" | "closed" | "demilestoned" | "labeled" | "locked" | "milestoned" | "opened" | "pinned" | "reopened" | "transferred" | "unassigned" | "unlabeled" | "unlocked" | "unpinned";
    issue: {
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        node_id: string;
        user: {
            login: string;
        } | null;
        labels: {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }[];
        locked: boolean;
    };
}, {
    action: "deleted" | "edited" | "assigned" | "closed" | "demilestoned" | "labeled" | "locked" | "milestoned" | "opened" | "pinned" | "reopened" | "transferred" | "unassigned" | "unlabeled" | "unlocked" | "unpinned";
    issue: {
        author_association: "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER";
        node_id: string;
        user: {
            login: string;
        } | null;
        labels: {
            node_id: string;
            color: string;
            default: boolean;
            description: string | null;
            id: number;
            name: string;
            url: string;
        }[];
        locked: boolean;
    };
}>;
export declare const sponsorshipsAsMaintainer: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        sponsorEntity: z.ZodNullable<z.ZodObject<{
            login: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            login: string;
        }, {
            login: string;
        }>>;
        tier: z.ZodNullable<z.ZodObject<{
            monthlyPriceInCents: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            monthlyPriceInCents: number;
        }, {
            monthlyPriceInCents: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        sponsorEntity: {
            login: string;
        } | null;
        tier: {
            monthlyPriceInCents: number;
        } | null;
    }, {
        sponsorEntity: {
            login: string;
        } | null;
        tier: {
            monthlyPriceInCents: number;
        } | null;
    }>, "many">;
    pageInfo: z.ZodObject<{
        endCursor: z.ZodNullable<z.ZodString>;
        hasNextPage: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        endCursor: string | null;
        hasNextPage: boolean;
    }, {
        endCursor: string | null;
        hasNextPage: boolean;
    }>;
    totalCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    nodes: {
        sponsorEntity: {
            login: string;
        } | null;
        tier: {
            monthlyPriceInCents: number;
        } | null;
    }[];
    pageInfo: {
        endCursor: string | null;
        hasNextPage: boolean;
    };
    totalCount: number;
}, {
    nodes: {
        sponsorEntity: {
            login: string;
        } | null;
        tier: {
            monthlyPriceInCents: number;
        } | null;
    }[];
    pageInfo: {
        endCursor: string | null;
        hasNextPage: boolean;
    };
    totalCount: number;
}>;
//# sourceMappingURL=schema.d.ts.map
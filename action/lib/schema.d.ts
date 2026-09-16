import { z } from 'zod';
export declare const configuration: z.ZodObject<{
    githubPersonalAccessToken: z.ZodString;
    githubWorkflowToken: z.ZodString;
    issueLabels: z.ZodPipe<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodTransform<string[], string>>, z.ZodTransform<string[], string[]>>;
    issueLimitCommenter: z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>;
    issueLockOnClose: z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>;
    issueMessageNotSponsor: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    issueMessageWelcome: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    isOrganization: z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>;
    sponsorActiveOnly: z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>;
    sponsorExemptFileLocation: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    sponsorMinimum: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const issueCommentPayload: z.ZodObject<{
    action: z.ZodUnion<readonly [z.ZodLiteral<"created">, z.ZodLiteral<"deleted">, z.ZodLiteral<"edited">]>;
    comment: z.ZodObject<{
        author_association: z.ZodUnion<readonly [z.ZodLiteral<"COLLABORATOR">, z.ZodLiteral<"CONTRIBUTOR">, z.ZodLiteral<"FIRST_TIMER">, z.ZodLiteral<"FIRST_TIME_CONTRIBUTOR">, z.ZodLiteral<"MANNEQUIN">, z.ZodLiteral<"MEMBER">, z.ZodLiteral<"NONE">, z.ZodLiteral<"OWNER">]>;
        node_id: z.ZodString;
        user: z.ZodNullable<z.ZodObject<{
            login: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    issue: z.ZodObject<{
        labels: z.ZodArray<z.ZodObject<{
            color: z.ZodString;
            default: z.ZodBoolean;
            description: z.ZodNullable<z.ZodString>;
            id: z.ZodNumber;
            name: z.ZodString;
            node_id: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>>;
        user: z.ZodNullable<z.ZodObject<{
            login: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const issuesPayload: z.ZodObject<{
    action: z.ZodUnion<readonly [z.ZodLiteral<"assigned">, z.ZodLiteral<"closed">, z.ZodLiteral<"deleted">, z.ZodLiteral<"demilestoned">, z.ZodLiteral<"edited">, z.ZodLiteral<"labeled">, z.ZodLiteral<"locked">, z.ZodLiteral<"milestoned">, z.ZodLiteral<"opened">, z.ZodLiteral<"pinned">, z.ZodLiteral<"reopened">, z.ZodLiteral<"transferred">, z.ZodLiteral<"unassigned">, z.ZodLiteral<"unlabeled">, z.ZodLiteral<"unlocked">, z.ZodLiteral<"unpinned">]>;
    issue: z.ZodObject<{
        author_association: z.ZodUnion<readonly [z.ZodLiteral<"COLLABORATOR">, z.ZodLiteral<"CONTRIBUTOR">, z.ZodLiteral<"FIRST_TIMER">, z.ZodLiteral<"FIRST_TIME_CONTRIBUTOR">, z.ZodLiteral<"MANNEQUIN">, z.ZodLiteral<"MEMBER">, z.ZodLiteral<"NONE">, z.ZodLiteral<"OWNER">]>;
        labels: z.ZodArray<z.ZodObject<{
            color: z.ZodString;
            default: z.ZodBoolean;
            description: z.ZodNullable<z.ZodString>;
            id: z.ZodNumber;
            name: z.ZodString;
            node_id: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>>;
        locked: z.ZodBoolean;
        node_id: z.ZodString;
        user: z.ZodNullable<z.ZodObject<{
            login: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const sponsorshipsAsMaintainer: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        sponsorEntity: z.ZodNullable<z.ZodObject<{
            login: z.ZodString;
        }, z.core.$strip>>;
        tier: z.ZodNullable<z.ZodObject<{
            monthlyPriceInCents: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    pageInfo: z.ZodObject<{
        endCursor: z.ZodNullable<z.ZodString>;
        hasNextPage: z.ZodBoolean;
    }, z.core.$strip>;
    totalCount: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map
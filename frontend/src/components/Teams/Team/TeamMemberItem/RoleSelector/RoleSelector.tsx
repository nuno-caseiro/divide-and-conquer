import React from 'react';

import Text from '@/components/Primitives/Text/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { getFormattedTeamUserRole } from '@/utils/getFormattedTeamUserRole';
import Separator from '@/components/Primitives/Separator/Separator';
import TeamRolePopover from '@/components/Primitives/Popovers/TeamRolePopover/TeamRolePopover';

export type RoleSelectorProps = {
  role: TeamUserRoles;
  userId: string;
  isTeamPage?: boolean;
  teamId?: string;
  canChangeRole?: boolean;
};

const RoleSelector = ({
  role,
  userId,
  isTeamPage = false,
  teamId,
  canChangeRole = true,
}: RoleSelectorProps) => (
  <Flex gap="8" align="center" data-testid="roleSelector">
    <Text color="primary200" size="sm">
      Role
    </Text>
    <Separator orientation="vertical" size="md" />
    <Text color="primary800" size="sm" fontWeight="medium">
      {getFormattedTeamUserRole(role)}
    </Text>
    {canChangeRole && <TeamRolePopover userId={userId} isTeamPage={isTeamPage} teamId={teamId} />}
  </Flex>
);

export default RoleSelector;
